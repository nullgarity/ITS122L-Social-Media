import React from 'react';
import './NavBar.css';
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optional: clear any auth state
    localStorage.removeItem("token");
    navigate("/login"); // Navigate to LoginRegister page
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="logo" onClick={() => navigate("/")}>
          MySocial
        </div>
      </div>

      <div className="navbar-center">
        <button className="nav-button home-button" onClick={() => window.location.reload()}>
          Home
        </button>
      </div>

      <div className="navbar-right">
        <button className="nav-button mylikes-button" onClick={() => navigate("/my-likes")}>
          My Likes
        </button>
        <button className="nav-button logout-button" onClick={handleLogout}>Logout</button>
        <div className="user-info">
          <img
            src="https://via.placeholder.com/30"
            alt="Profile"
            className="profile-pic"
          />
          <span>John Doe</span>
        </div>
      </div>
    </div>
  );
}