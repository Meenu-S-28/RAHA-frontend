import React, { useState } from "react";
import "../styles/auth.css";

export default function LoginPage() {
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // default role

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login with:", { userID, password, role });

    // Temporary auth simulation
    if (userID && password) {
      alert(`Welcome ${role} ${userID}!`);
      // navigate("/dashboard");
    } else {
      alert("Please fill all fields");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login to RAHA</h2>
      <form className="auth-form" onSubmit={handleLogin}>
        <label>User ID:</label>
        <input
          type="text"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Login as:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="healthcare">Healthcare Provider</option>
          <option value="user">User</option>
        </select>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
