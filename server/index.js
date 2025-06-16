// FILE: backend/index.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const xlsx = require("xlsx");
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

// Create new exam from Excel file
app.post("/api/exams/upload", upload.single("file"), async (req, res) => {
  try {
    const { originalname, path } = req.file;
    const workbook = xlsx.readFile(path);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const examName = originalname.split(".")[0];
    const examResult = await pool.query("INSERT INTO exams (name) VALUES ($1) RETURNING id", [examName]);
    const examId = examResult.rows[0].id;

    for (let row of data) {
      await pool.query(
        "INSERT INTO words (exam_id, word, meaning, translation) VALUES ($1, $2, $3, $4)",
        [examId, row.word, row.meaning, row.translation]
      );
    }

    res.status(201).json({ message: "Exam created from Excel", examId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error processing Excel file");
  }
});

// Update exam name
app.put("/api/exams/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const examId = req.params.id;
    const result = await pool.query("UPDATE exams SET name = $1 WHERE id = $2 RETURNING *", [name, examId]);
    if (result.rows.length === 0) return res.status(404).send("Exam not found");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Delete an exam and its words
app.delete("/api/exams/:id", async (req, res) => {
  try {
    const examId = req.params.id;
    await pool.query("DELETE FROM words WHERE exam_id = $1", [examId]);
    const result = await pool.query("DELETE FROM exams WHERE id = $1 RETURNING *", [examId]);
    if (result.rows.length === 0) return res.status(404).send("Exam not found");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Add a word to an exam
app.post("/api/exams/:id/words", async (req, res) => {
  try {
    const examId = req.params.id;
    const { word, meaning, translation } = req.body;
    const result = await pool.query(
      "INSERT INTO words (exam_id, word, meaning, translation) VALUES ($1, $2, $3, $4) RETURNING *",
      [examId, word, meaning, translation]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Update a word
app.put("/api/words/:id", async (req, res) => {
  try {
    const wordId = req.params.id;
    const { word, meaning, translation } = req.body;
    const result = await pool.query(
      "UPDATE words SET word = $1, meaning = $2, translation = $3 WHERE id = $4 RETURNING *",
      [word, meaning, translation, wordId]
    );
    if (result.rows.length === 0) return res.status(404).send("Word not found");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Delete a word
app.delete("/api/words/:id", async (req, res) => {
  try {
    const wordId = req.params.id;
    const result = await pool.query("DELETE FROM words WHERE id = $1 RETURNING *", [wordId]);
    if (result.rows.length === 0) return res.status(404).send("Word not found");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/api/connection", async (req, res) => {
  res.json({ status: "OK", message: "Backend is reachable!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
