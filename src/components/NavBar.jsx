import React from 'react';
import './NavBar.css'; // Make sure this file exists

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">MyApp</div>
      </div>

      <div className="navbar-center">
        <button className="nav-button" onClick={() => window.location.reload()}>
          Home
        </button>
      </div>

      <div className="navbar-right">
        <div className="user-info">
          <img src="https://via.placeholder.com/30" alt="Profile" className="profile-pic" />
          <span>John Doe</span>
        </div>
        <button className="nav-button">My Likes</button>
        <button className="logout-button">Logout</button>
      </div>
    </nav>
  );
}
