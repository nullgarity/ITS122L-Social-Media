import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileDetails.css';

const ProfileDetails = ({ user, isOwnProfile = false }) => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleMessage = () => {
    navigate('/messenger');
  };

  return (
    <div className="profile-details">
      <div className="cover-photo-container">
        <img
          src={user.cover_photo || 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop'}
          alt="Cover"
          className="cover-photo"
        />
      </div>
      
      <div className="profile-info-container">
        <div className="profile-picture-section">
          <img
            src={user.profile_picture || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'}
            alt="Profile"
            className="profile-picture"
          />
        </div>
        
        <div className="profile-info">
          <div className="profile-name-section">
            <h1 className="profile-name">
              {user.fName} {user.lName}
            </h1>
            <div className="profile-stats">
              <span className="stat">
                <strong>0</strong> friends
              </span>
              <span className="stat">
                <strong>0</strong> posts
              </span>
            </div>
          </div>
          
          <div className="profile-actions">
            {isOwnProfile ? (
              <button className="edit-profile-btn" onClick={handleEditProfile}>
                ✏️ Edit Profile
              </button>
            ) : (
              <>
                <button className="message-btn" onClick={handleMessage}>
                  💬 Message
                </button>
                <button className="add-friend-btn">
                  👥 Add Friend
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {user.bio && (
        <div className="profile-bio">
          <h3>About</h3>
          <p>{user.bio}</p>
        </div>
      )}
      
      <div className="profile-details-info">
        <div className="info-section">
          <h3>Details</h3>
          <div className="info-item">
            <span className="info-icon">📧</span>
            <span className="info-text">{user.email}</span>
          </div>
          <div className="info-item">
            <span className="info-icon">📅</span>
            <span className="info-text">
              Joined {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
              }) : 'Recently'}
            </span>
          </div>
        </div>
        
        <div className="info-section">
          <h3>Photos</h3>
          <div className="photos-grid">
            <div className="photo-placeholder">
              <span>📷</span>
              <p>No photos yet</p>
            </div>
          </div>
        </div>
        
        <div className="info-section">
          <h3>Friends</h3>
          <div className="friends-grid">
            <div className="friends-placeholder">
              <span>👥</span>
              <p>No friends to show</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
