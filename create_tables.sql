DROP TABLE IF EXISTS words;
DROP TABLE IF EXISTS exams;

CREATE TABLE exams (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE words (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    word TEXT NOT NULL,
    meaning TEXT,
    translation TEXT
);
