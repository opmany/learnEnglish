const API_URL = process.env.BACKEND_URL;

export async function getExams() {
  const res = await fetch(`${API_URL}/exams`);
  return res.json();
}

export async function getExam(id) {
  const res = await fetch(`${API_URL}/exams/${id}`);
  return res.json();
}

export async function createExam(name) {
  const res = await fetch(`${API_URL}/exams`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

export async function updateExam(id, name) {
  const res = await fetch(`${API_URL}/exams/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

export async function deleteExam(id) {
  const res = await fetch(`${API_URL}/exams/${id}`, { method: "DELETE" });
  return res.json();
}

export async function addWord(examId, word) {
  const res = await fetch(`${API_URL}/exams/${examId}/words`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(word),
  });
  return res.json();
}

export async function updateWord(id, word) {
  const res = await fetch(`${API_URL}/words/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(word),
  });
  return res.json();
}

export async function deleteWord(id) {
  const res = await fetch(`${API_URL}/words/${id}`, { method: "DELETE" });
  return res.json();
}

export async function uploadExcel(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/exams/upload`, {
    method: "POST",
    body: formData,
  });

  return res.json();
}
