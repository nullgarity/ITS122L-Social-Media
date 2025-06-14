import React, { useEffect, useState } from 'react';
import './NavBar.css';
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // Redirect to login
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="logo" onClick={() => navigate("/home")}>
          MySocial
        </div>
      </div>

      <div className="navbar-center">
        <button className="nav-button home-button" onClick={() => navigate("/home")}>
          Home
        </button>
      </div>

      <div className="navbar-right">
        <button className="nav-button myprofile-button" onClick={() => navigate("profile/:id")}>
          My Profile
        </button>
        <button className="nav-button logout-button" onClick={() => navigate("/loginregister")}>Logout</button>

        {user && (
          <div className="user-info">
            <img
              src={user.profile_picture || "https://via.placeholder.com/30"}
              alt="Profile"
              className="profile-pic"
            />
            <span>{user.fName} {user.lName}</span>
          </div>
        )}
      </div>
    </div>
  );
}