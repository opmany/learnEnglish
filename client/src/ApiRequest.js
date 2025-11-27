const API_URL = process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : "http://localhost:3001";

export async function getExams() {
  const res = await fetch(`${API_URL}/api/exams`);
  return res.json();
}

export async function getExam(id) {
  const res = await fetch(`${API_URL}/api/exams/${id}`);
  return res.json();
}


export async function getConnection() {
    try {
    const res = await fetch(`${API_URL}/api/connection`, { method: "GET" });
    if (!res.ok) throw new Error("Failed to connect");
    const data = await res.json();
    return { success: true, message: data.message };
  } catch (err) {
    return { success: false, message: "Backend unreachable 😢" };
  }
}

export async function updateExamWords(examId, words) {
  const res = await fetch(`${API_URL}/api/exams/${examId}/words`, {
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
  const res = await fetch(`${API_URL}/api/exam-list`);
  return await res.json();
}

export async function parseExcel(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/api/parse`, {
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
  const res = await fetch(`${API_URL}/api/insert`, {
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


// --- Signup ---
export async function signup(username, password, email) {
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email }),
  });

  if (!response.ok) {
    throw new Error("Signup failed");
  }

  const data = await response.json();
  return data;
}

// --- Login ---
export async function login(username, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();

  // Store the token in localStorage
  localStorage.setItem("token", data.token);
  localStorage.setItem("username", data.username);

  return data;
}

// --- Get token ---
export function getToken() {
  return localStorage.getItem("token");
}

// --- Fetch classes for logged-in user ---
export async function getMyClasses() {
  const token = getToken();
  const response = await fetch(`${API_URL}/my-classes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch classes");
  }

  return response.json();
}

// --- Fetch exams for a class ---
export async function getExamsOfClass(classId) {
  const token = getToken();
  const response = await fetch(`${API_URL}/classes/${classId}/exams`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch exams");
  }

  return response.json();
}

// --- Fetch words for an exam ---
export async function getWords(examId) {
  const token = getToken();
  const response = await fetch(`${API_URL}/exams/${examId}/words`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch words");
  }

  return response.json();
}

// --- Create a new class ---
export async function createExam(name, classId) {
  const token = getToken();
  const response = await fetch(`${API_URL}/exam`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, class_id: classId }),
  });

  if (!response.ok) throw new Error("Failed to create exam");

  return response.json();
}

// Get class details
export async function getClassById(classId) {
  const token = getToken();
  const response = await fetch(`${API_URL}/class/${classId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch class");
  return response.json();
}

// Get exams for class
export async function getExamsByClass(classId) {
  const token = getToken();
  const res = await fetch(`${API_URL}/classes/${classId}/exams`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch exams");
  return res.json();
}

// Set class default exam
export async function setDefaultExam(classId, examId) {
  const token = getToken();
  const response = await fetch(
    `${API_URL}/classes/${classId}/default-exam/${examId}`, // include examId
    {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to set default exam");
  }

  return response.json();
}

export async function createClass(name) {
  const token = getToken();
  const response = await fetch(`${API_URL}/class`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to create class: ${text}`);
  }

  return response.json();
}

export async function getMyExams() {
  const token = getToken();
  const response = await fetch(`${API_URL}/my-exams`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch exams");
  return response.json();
}

export async function generateInviteLink(classId) {
  const token = getToken();
  const res = await fetch(`${API_URL}/class/${classId}/invite-link`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
}

export async function joinClassFromSignature(signature) {
  const token = getToken();
  const res = await fetch(`${API_URL}/class/join/${signature}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
}

export async function classPreview(signature) {
    const token = getToken();

    const res = await fetch(`${API_URL}/class/preview/${signature}`, {
    method: "GET",   
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
}