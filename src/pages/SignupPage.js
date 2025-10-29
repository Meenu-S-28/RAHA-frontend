import React, { useState } from "react";
import "../styles/auth.css";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    hospital: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Provider signup:", formData);
    alert("Healthcare Provider registered successfully!");
  };

  return (
    <div className="auth-container">
      <h2>Healthcare Provider Signup</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Full Name:</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Phone:</label>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label>Hospital / Clinic:</label>
        <input
          name="hospital"
          value={formData.hospital}
          onChange={handleChange}
          required
        />

        <label>Password:</label>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
