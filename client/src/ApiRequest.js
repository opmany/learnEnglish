const API_URL = process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL + "/api" : "http://localhost:3001/api";

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

export async function getConnection() {
    try {
    const res = await fetch(`${API_URL}/connection`, { method: "GET" });
    if (!res.ok) throw new Error("Failed to connect");
    const data = await res.json();
    return { success: true, message: data.message };
  } catch (err) {
    return { success: false, message: "Backend unreachable 😢" };
  }
}

export async function updateExamWords(examId, words) {
  const res = await fetch(`${API_URL}/exams/${examId}/words`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ words }),
  });

  if (!res.ok) {
    throw new Error("Failed to update exam words");
  }

  return res.json();
}

export async function getExamList() {
  const res = await fetch(`${API_URL}/exam-list`);
  return await res.json();
}

export async function parseExcel(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/parse`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to parse Excel file");
  }

  // now returns { fileName, rows }
  return res.json();
}

export async function insertExam(rows, fileName) {
  const res = await fetch(`${API_URL}/insert`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rows, fileName }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "Failed to insert exam");
    throw new Error(errText || "Failed to insert exam");
  }

  return res.json();
}