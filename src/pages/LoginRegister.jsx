import React from 'react';
import './css/LoginRegister.css'

export default function LoginRegister() {
  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-logo">
          <h1>MySocial</h1> {/* Placeholder logo */}
        </div>
        <div className="home-box">
          <input type="text" placeholder="Email or phone number" />
          <input type="password" placeholder="Password" />
          <button className="btn primary">Sign In</button>
          <a href="#">Forgot password?</a>
          <hr />
          <button className="btn secondary">Register</button>
        </div>
      </div>
      <footer>
        <p>&copy; 2025 MySocial</p>
      </footer>
    </div>
  );
}