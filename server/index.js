const express = require("express");
const cors = require("cors");
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

const JWT_SECRET = process.env.JWT_SECRET || "sdgjkhsdgkkjhndgkkjbcvjh";


app.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = await pool.query(
    'INSERT INTO users (username, password_hash, email) VALUES ($1, $2, $3) RETURNING id, username',
    [username, hash, email]
  );
  res.json(user.rows[0]);
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

  if (!user.rows.length) return res.status(401).json({ error: 'Invalid username' });

  const valid = await bcrypt.compare(password, user.rows[0].password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid password' });

  const token = jwt.sign({ id: user.rows[0].id }, JWT_SECRET, { expiresIn: '3h' });
  res.json({ token });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // user.id is available
    next();
  });
}

async function checkTeacher(req, classId) {
  const result = await pool.query(
    'SELECT role FROM class_memberships WHERE user_id=$1 AND class_id=$2',
    [req.user.id, classId]
  );
  if (!result.rows.length || result.rows[0].role !== 'teacher') {
    throw new Error('Forbidden');
  }
}

async function checkAdmin(req, res, next) {
  const result = await pool.query('SELECT role FROM users WHERE id=$1', [req.user.id]);
  if (!result.rows.length || result.rows[0].role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' });
  }
  next();
}


// Get all exams for a class
app.get('/classes/:id/exams', authenticateToken, async (req, res) => {
  const classId = req.params.id;
  const exams = await pool.query('SELECT * FROM exams WHERE class_id=$1', [classId]);
  res.json(exams.rows);
});

// Get all words for an exam
app.get('/exams/:id/words', authenticateToken, async (req, res) => {
  const examId = req.params.id;
  const words = await pool.query('SELECT * FROM words WHERE exam_id=$1', [examId]);
  res.json(words.rows);
});


// Get all exams for a class
app.post("/class", authenticateToken, async (req, res) => {
  const { name } = req.body;
  const teacher_id = req.user.id;

  if (!name) return res.status(400).json({ message: "Class name is required" });

  const client = await pool.connect(); // get a client for transaction

  try {
    await client.query("BEGIN");

    // 1. Create the class
    const classResult = await client.query(
      "INSERT INTO classes (name, teacher_id) VALUES ($1, $2) RETURNING *",
      [name, teacher_id]
    );
    const newClass = classResult.rows[0];
    if (!newClass) throw new Error("Failed to create class");

    // 2. Add teacher to class_memberships
    await client.query(
      "INSERT INTO class_memberships (user_id, class_id, role) VALUES ($1, $2, 'teacher')",
      [teacher_id, newClass.id]
    );

    // 3. Add admin (if exists)
    const adminResult = await client.query(
      "SELECT id FROM users WHERE is_admin = TRUE LIMIT 1"
    );
    const admin_id = adminResult.rows[0]?.id;

    if (admin_id && admin_id !== teacher_id) {
      await client.query(
        "INSERT INTO class_memberships (user_id, class_id, role) VALUES ($1, $2, 'admin')",
        [admin_id, newClass.id]
      );
    }

    await client.query("COMMIT");
    res.status(201).json(newClass);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Create class failed:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
});

app.post("/exam", authenticateToken, async (req, res) => {
  const { name, class_id } = req.body;
  const user_id = req.user.id;

  if (!name || !class_id) {
    return res.status(400).json({ message: "Exam name and class_id are required" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check permissions
    const permResult = await client.query(
      `SELECT role FROM class_memberships WHERE user_id=$1 AND class_id=$2`,
      [user_id, class_id]
    );

    const classResult = await client.query(
      `SELECT teacher_id, default_exam_id FROM classes WHERE id=$1`,
      [class_id]
    );

    if (!classResult.rows[0]) throw new Error("Class not found");

    const isTeacher = classResult.rows[0].teacher_id === user_id;
    const role = permResult.rows[0]?.role;

    if (!role && !isTeacher) {
      return res.status(403).json({ message: "Not allowed to add exams" });
    }

    // Determine if default exam
    const isDefault = !classResult.rows[0].default_exam_id;

    // Insert exam
    const examResult = await client.query(
      `INSERT INTO exams (name, class_id, is_default) VALUES ($1, $2, $3) RETURNING *`,
      [name, class_id, isDefault]
    );

    // Update class default_exam_id if needed
    if (isDefault) {
      await client.query(
        `UPDATE classes SET default_exam_id=$1 WHERE id=$2`,
        [examResult.rows[0].id, class_id]
      );
    }

    await client.query("COMMIT");
    res.status(201).json(examResult.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
});

app.get("/my-classes", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      `SELECT c.id, c.name, u.username AS teacher_username
       FROM classes c
       LEFT JOIN users u ON c.teacher_id = u.id
       JOIN class_memberships cm ON cm.class_id = c.id
       WHERE cm.user_id = $1`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Get all exams for all classes the user belongs to
app.get("/my-exams", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT e.*, c.name AS class_name
       FROM exams e
       JOIN classes c ON e.class_id = c.id
       JOIN class_memberships cm ON cm.class_id = c.id
       WHERE cm.user_id = $1`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



app.put("/classes/:classId/default-exam/:examId", async (req, res) => {
    const { classId, examId } = req.params;

    try {
        await pool.query("BEGIN");

        // remove previous defaults
        await pool.query(
            "UPDATE exams SET is_default = false WHERE class_id = $1",
            [classId]
        );

        // set selected exam to default
        await pool.query(
            "UPDATE exams SET is_default = true WHERE id = $1 AND class_id = $2",
            [examId, classId]
        );

        // update class default reference
        await pool.query(
            "UPDATE classes SET default_exam_id = $1 WHERE id = $2",
            [examId, classId]
        );

        await pool.query("COMMIT");
        res.json({ message: "Default exam updated successfully" });
    } catch (error) {
        await pool.query("ROLLBACK");
        res.status(500).json({ error: error.message });
    }
});

app.get("/class/:id", authenticateToken, async (req, res) => {
  const classId = req.params.id;

  try {
    const result = await pool.query(
      `SELECT c.*, u.username AS teacher_username
       FROM classes c
       LEFT JOIN users u ON c.teacher_id = u.id
       WHERE c.id = $1`,
      [classId]
    );

    if (!result.rows[0]) return res.status(404).json({ message: "Class not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/class/:id/exams", authenticateToken, async (req, res) => {
  const classId = req.params.id;

  try {
    const result = await pool.query(
      `SELECT * FROM exams
       WHERE class_id = $1
       ORDER BY id`,
      [classId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET /class/:id/exams error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

async function checkClassPermission(userId, classId) {
  const q = await pool.query(
    `SELECT role 
     FROM class_memberships 
     WHERE user_id = $1 AND class_id = $2`,
    [userId, classId]
  );

  if (q.rows.length === 0) return false;
  const role = q.rows[0].role;
  return role === "teacher" || role === "admin";
}

app.put("/class/:id/default-exam", authenticateToken, async (req, res) => {
  const classId = req.params.id;
  const { exam_id } = req.body;
  const userId = req.user.id;

  if (!exam_id) return res.status(400).json({ message: "Missing exam_id" });

  try {
    const allowed = await checkClassPermission(userId, classId);
    if (!allowed) return res.status(403).json({ message: "Not allowed" });

    // Set default
    await pool.query(
      `UPDATE classes SET default_exam_id = $1 WHERE id = $2`,
      [exam_id, classId]
    );

    // Update exam table flags (optional)
    await pool.query(
      `UPDATE exams 
       SET is_default = (id = $1) 
       WHERE class_id = $2`,
      [exam_id, classId]
    );

    res.json({ message: "Default exam updated" });
  } catch (err) {
    console.error("PUT /class/:id/default-exam error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//------------------------------------------------------------------------------------------------------------------------

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
