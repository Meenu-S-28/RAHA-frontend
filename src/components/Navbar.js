import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">RAHA</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/finder">Nearest Facility Finder</Link></li>
        <li><Link to="/services">Medical Services</Link></li>
      </ul>
      <div className="auth-links">
        <Link to="/login" className="login-btn">Login</Link>
        <Link to="/signup" className="signup-btn">Signup</Link>
      </div>
    </nav>
  );
}
