import React from 'react';
import './LoginRegister.css'

export default function LoginRegister() {
  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-logo">
          <h1>MySocial</h1> {/* Placeholder logo */}
        </div>
        <div className="home-box">
          <input type="text" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button className="btn signin-btn">Sign In</button>
          <button className="btn register-btn">Register</button>
        </div>
      </div>
      <footer>
        <p>&copy;ITS122L Social Media | Mendoza, Fuensalida, Ercia, Panes, Tresvalles</p>
      </footer>
    </div>
  );
}