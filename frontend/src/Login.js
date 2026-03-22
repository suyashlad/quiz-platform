import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Enter username and password");
      return;
    }

    try {
      const data = await loginUser({ username, password });

      if (data.message) {
        alert(data.message);
        return;
      }

      // ✅ store user
      localStorage.setItem("user", JSON.stringify(data));

      // 🔥 redirect
      navigate("/");
    } catch (err) {
      alert("Login failed. Server issue.");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>

      <div className="card">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;