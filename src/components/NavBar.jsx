import React from 'react';
import './NavBar.css';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import defaultProfilePic from '../assets/default-profile.png';

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

        {user && (
          <div
            className="user-info"
            onClick={() => navigate(`/profile`)}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={user.profile_picture || defaultProfilePic}
              alt="Profile"
              className="profile-pic"
            />
            <span>{user.fName} {user.lName}</span>
          </div>
        )}

        <button className="nav-button logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}