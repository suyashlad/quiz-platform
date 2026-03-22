import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Quiz from "./Quiz";
import Admin from "./Admin";
import Login from "./Login";
import "./styles.css";

function App() {
  const [quizStarted, setQuizStarted] = useState(false);

  // 🔥 safer parsing (prevents crash if localStorage is null)
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("user");
    setQuizStarted(false); // reset state
    window.location.href = "/login"; // cleaner redirect
  };

  return (
    <Router>
      <div className="container">
        <h1>Quiz System</h1>

        {/* 🔥 Navbar */}
        {!quizStarted && (
          <div className="nav">
            <Link to="/">Quiz</Link>

            {user && user.is_admin === 1 && (
              <Link to="/admin">Admin</Link>
            )}

            {!user && <Link to="/login">Login</Link>}

            {user && (
              <button onClick={logout}>Logout</button>
            )}
          </div>
        )}

        <Routes>
          <Route
            path="/"
            element={<Quiz setQuizStarted={setQuizStarted} />}
          />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;