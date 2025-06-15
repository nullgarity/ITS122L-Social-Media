import React from 'react';
import './NavBar.css';
import { useNavigate } from 'react-router-dom';

export default function NavBar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleProfileClick = () => {
    if (user?.id) {
      navigate(`/profile/${user.id}`);
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="logo" onClick={() => navigate('/home')}>
          MySocial
        </div>
      </div>

      <div className="navbar-center">
        <button 
          className="nav-button home-button" 
          onClick={() => navigate('/home')}
          title="Home"
        >
          🏠 Home
        </button>
        <button 
          className="nav-button messenger-button" 
          onClick={() => navigate('/messenger')}
          title="Messenger"
        >
          💬 Messenger
        </button>
      </div>

      <div className="navbar-right">
        <div className="user-info" onClick={handleProfileClick}>
          <img
            src={user?.profile_picture || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'}
            alt="Profile"
            className="profile-pic"
          />
          <span className="user-name">{user?.fName} {user?.lName}</span>
        </div>
        
        <div className="navbar-actions">
          <button 
            className="nav-button mylikes-button" 
            onClick={() => navigate('/my-likes')}
            title="My Likes"
          >
            ❤️
          </button>
          <button 
            className="nav-button logout-button" 
            onClick={handleLogout}
            title="Logout"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
