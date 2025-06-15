import React from 'react';
import './NavBar.css';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

export default function NavBar({ user }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="logo" onClick={() => navigate('/home')}>
          MySocial
        </div>
      </div>

      <div className="navbar-center">
        <button className="nav-button home-button" onClick={() => navigate('/home')}>
          Home
        </button>
      </div>

      <div className="navbar-right">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <div className="user-info">
          <img
            src={user.profile_picture || 'https://via.placeholder.com/30'}
            alt="Profile"
            className="profile-pic"
          />
          <span>{user.fName} {user.lName}</span>
        </div>
        <button className="nav-button mylikes-button" onClick={() => navigate('/my-likes')}>
          My Likes
        </button>
        <button className="nav-button logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}