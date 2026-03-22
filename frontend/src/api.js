const BASE_URL = "http://10.124.243.174:5000";

// 🔐 AUTH
export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// 📊 QUESTIONS
export const getQuestions = async () => {
  const res = await fetch(`${BASE_URL}/questions`);
  return res.json();
};

// 📝 SUBMIT
export const submitQuiz = async (data) => {
  const res = await fetch(`${BASE_URL}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// 📂 UPLOAD
export const uploadQuestions = async (formData) => {
  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });
  return res.json();
};

// 📈 RESULTS
export const getResults = async () => {
  const res = await fetch(`${BASE_URL}/admin/results`);
  return res.json();
};

// 👥 USERS
export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/admin/users`);
  return res.json();
};

// ➕ ADD USER
export const addUserApi = async (data) => {
  const res = await fetch(`${BASE_URL}/admin/add_user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// ❌ DELETE USER
export const deleteUserApi = async (id) => {
  const res = await fetch(`${BASE_URL}/admin/delete_user/${id}`, {
    method: "DELETE",
  });
  return res.json();
};