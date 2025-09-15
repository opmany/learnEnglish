const express = require("express");
const cors = require("cors");
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// File upload middleware
const upload = multer({ dest: "uploads/" });

// PostgreSQL connection
const pool = new Pool({
  // REMOVE WHEN COMMITING
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

// Get all exams with words
app.get("/api/exams", async (req, res) => {
  try {
    const exams = await pool.query("SELECT * FROM exams");
    const words = await pool.query("SELECT * FROM words");
    const examsWithWords = exams.rows.map(exam => ({
      ...exam,
      words: words.rows.filter(w => w.exam_id === exam.id)
    }));
    res.json(examsWithWords);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Get only exam IDs and names (for selection)
app.get("/api/exam-list", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name FROM exams ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to load exam list");
  }
});


// Get a single exam with words
app.get("/api/exams/:id", async (req, res) => {
  try {
    const examId = req.params.id;
    const exam = await pool.query("SELECT * FROM exams WHERE id = $1", [examId]);
    if (exam.rows.length === 0) return res.status(404).send("Exam not found");

    const words = await pool.query("SELECT * FROM words WHERE exam_id = $1", [examId]);
    res.json({ ...exam.rows[0], words: words.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Create a new exam
app.post("/api/exams", async (req, res) => {
  try {
    const { name } = req.body;
    const result = await pool.query("INSERT INTO exams (name) VALUES ($1) RETURNING *", [name]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Check connection to the database
app.get("/api/connection", async (req, res) => {
  res.json({ status: "OK", message: "Site Online!" });
});

// Replace all the words in an exam with the new array
app.put("/api/exams/:id/words", async (req, res) => {
  const examId = req.params.id;
  const { words } = req.body;

  if (!Array.isArray(words)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const receivedIds = words.filter(w => w.id).map(w => w.id);

    // 1. Delete words that are missing from the new list
    if (receivedIds.length > 0) {
      await client.query(
        `DELETE FROM words 
         WHERE exam_id = $1 
         AND id NOT IN (${receivedIds.map((_, i) => `$${i + 2}`).join(',')})`,
        [examId, ...receivedIds]
      );
    } else {
      // No IDs were sent — delete all words for this exam
      await client.query(
        `DELETE FROM words WHERE exam_id = $1`,
        [examId]
      );
    }

    // 2. Upsert words
    for (const word of words) {
      if (word.id) {
        await client.query(
          `UPDATE words SET word = $1, meaning = $2, translation = $3 WHERE id = $4 AND exam_id = $5`,
          [word.word, word.meaning, word.translation, word.id, examId]
        );
      } else {
        await client.query(
          `INSERT INTO words (exam_id, word, meaning, translation)
           VALUES ($1, $2, $3, $4)`,
          [examId, word.word, word.meaning, word.translation]
        );
      }
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "Words updated successfully" });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error updating words:", err);
    res.status(500).json({ message: "Error updating words" });

  } finally {
    client.release();
  }
});

app.post("/api/parse", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    // get raw rows with default values for empty cells
    const rawRows = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    // normalize each row's keys (case-insensitive) and fall back to positional mapping
    const rows = rawRows.map((raw) => {
      const mapped = { word: "", meaning: "", translation: "" };

      for (const key of Object.keys(raw)) {
        const k = key.toString().trim().toLowerCase();
        const val = raw[key];
        if (k === "word") mapped.word = val;
        else if (k === "meaning") mapped.meaning = val;
        else if (k === "translation") mapped.translation = val;
      }

      // if needed, fallback to positional columns (in case headers are missing)
      const vals = Object.values(raw);
      if (!mapped.word && vals[0] !== undefined) mapped.word = vals[0];
      if (!mapped.meaning && vals[1] !== undefined) mapped.meaning = vals[1];
      if (!mapped.translation && vals[2] !== undefined) mapped.translation = vals[2];

      return {
        word: String(mapped.word || "").trim(),
        meaning: String(mapped.meaning || "").trim(),
        translation: String(mapped.translation || "").trim(),
      };
    });

    // filter out completely empty rows (must have at least a word)
    const filtered = rows.filter((r) => r.word && r.word.length > 0);

    // return original filename so frontend can use it as exam name
    res.json({ fileName: req.file.originalname, rows: filtered });

  } catch (err) {
    console.error("Parse error:", err);
    res.status(500).send("Error parsing file");
  } finally {
    // cleanup temp file
    try { 
      fs.unlinkSync(req.file.path); 
    } catch (e) {}
  }
});

app.post("/api/insert", async (req, res) => {
  const { rows, fileName } = req.body;
  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ message: "No rows provided" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // sanitize exam name (strip extension and take basename)
    const rawName = fileName ? path.basename(fileName) : `Imported Exam ${Date.now()}`;
    const examName = rawName.replace(/\.[^/.]+$/, "").trim().slice(0, 255); // limit length

    // create exam
    const examResult = await client.query(
      "INSERT INTO exams (name) VALUES ($1) RETURNING *",
      [examName]
    );
    const exam = examResult.rows[0];

    // insert words (trim values). I use a single INSERT per row to keep it simple;
    // for large files use batched insert or COPY.
    for (let i = 0; i < rows.length; ++i) {
      const r = rows[i];
      const word = (r.word || "").toString().trim();
      const meaning = (r.meaning || "").toString().trim();
      const translation = (r.translation || "").toString().trim();
      if (!word) continue; // skip rows without a word

      await client.query(
        `INSERT INTO words (exam_id, word, meaning, translation)
         VALUES ($1, $2, $3, $4)`,
        [exam.id, word, meaning, translation]
      );
    }

    await client.query("COMMIT");

    const wordsRes = await pool.query("SELECT * FROM words WHERE exam_id = $1 ORDER BY id", [exam.id]);
    res.status(201).json({ ...exam, words: wordsRes.rows });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error inserting exam:", err);
    res.status(500).json({ message: "Error inserting exam" });
  } finally {
    client.release();
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
