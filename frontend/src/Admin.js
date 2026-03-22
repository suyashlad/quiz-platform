import { useState } from "react";
import {
  uploadQuestions,
  getQuestions,
  getResults,
  getUsers,
  addUserApi,
  deleteUserApi
} from "./api";

function Admin() {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState([]);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", password: "" });

  const [showUsers, setShowUsers] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // 🔒 Access control
  if (!user || user.is_admin !== 1) {
    return <h3>Access Denied</h3>;
  }

  // 📂 File upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) return alert("Select file");

    const formData = new FormData();
    formData.append("file", file);

    const data = await uploadQuestions(formData);
    alert(data.message);
  };

  // 📊 Load questions
  const loadQuestions = async () => {
    const data = await getQuestions();
    setQuestions(data);
  };

  // 📈 Load results (sorted)
  const loadResults = async () => {
    const data = await getResults();
    const sorted = data.sort((a, b) => b.score - a.score);
    setResults(sorted);
  };

  // 👥 Load users
  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  // ➕ Add user
  const addUser = async () => {
    if (!newUser.username || !newUser.password) {
      return alert("Enter username & password");
    }

    const data = await addUserApi(newUser);
    alert(data.message);

    setNewUser({ username: "", password: "" });
    loadUsers();
  };

  // ❌ Delete user
  const deleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    const data = await deleteUserApi(id);
    alert(data.message);

    loadUsers();
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <p>Welcome, <b>{user.username}</b></p>

      {/* 📂 Upload */}
      <div className="card">
        <h4>Upload Questions</h4>
        <input type="file" onChange={handleFileChange} />
        <button onClick={uploadFile}>Upload Excel</button>
      </div>

      {/* 📊 Questions */}
      <div className="card">
        <h4 onClick={() => setShowQuestions(!showQuestions)} style={{ cursor: "pointer" }}>
          Questions {showQuestions ? "▲" : "▼"}
        </h4>

        {showQuestions && (
          <>
            <button onClick={loadQuestions}>Load Questions</button>
            {questions.map((q) => (
              <p key={q.id}>{q.question}</p>
            ))}
          </>
        )}
      </div>

      {/* 📈 Results */}
      <div className="card">
        <h4 onClick={() => setShowResults(!showResults)} style={{ cursor: "pointer" }}>
          Results {showResults ? "▲" : "▼"}
        </h4>

        {showResults && (
          <>
            <button onClick={loadResults}>Load Results</button>
            {results.map((r, i) => (
              <p key={i}>
                {r.username} - {r.score} ({r.timestamp})
              </p>
            ))}
          </>
        )}
      </div>

      {/* 👤 Add User */}
      <div className="card">
        <h4>Add User</h4>

        <input
          placeholder="Username"
          value={newUser.username}
          onChange={(e) =>
            setNewUser({ ...newUser, username: e.target.value })
          }
        />

        <input
          placeholder="Password"
          type="password"
          value={newUser.password}
          onChange={(e) =>
            setNewUser({ ...newUser, password: e.target.value })
          }
        />

        <button onClick={addUser}>Add User</button>
      </div>

      {/* 👥 Manage Users */}
      <div className="card">
        <h4 onClick={() => setShowUsers(!showUsers)} style={{ cursor: "pointer" }}>
          Users {showUsers ? "▲" : "▼"}
        </h4>

        {showUsers && (
          <>
            <button onClick={loadUsers}>Load Users</button>

            {users.map((u) => (
              <div key={u.id} style={{ marginTop: "10px" }}>
                {u.username} {u.is_admin ? "(Admin)" : ""}

                {!u.is_admin && (
                  <button
                    style={{ marginLeft: "10px", backgroundColor: "red" }}
                    onClick={() => deleteUser(u.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Admin;