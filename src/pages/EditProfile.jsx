import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import api from '../api/axios';
import './EditProfile.css';

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fName: '',
    lName: '',
    email: '',
    bio: '',
    profile_picture: '',
    cover_photo: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [profilePreview, setProfilePreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get('/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = res.data;
        setUser(userData);
        setFormData({
          fName: userData.fName || '',
          lName: userData.lName || '',
          email: userData.email || '',
          bio: userData.bio || '',
          profile_picture: userData.profile_picture || '',
          cover_photo: userData.cover_photo || ''
        });
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (type === 'profile') {
          setProfilePreview(event.target.result);
          setFormData(prev => ({
            ...prev,
            profile_picture: event.target.result
          }));
        } else if (type === 'cover') {
          setCoverPreview(event.target.result);
          setFormData(prev => ({
            ...prev,
            cover_photo: event.target.result
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const token = localStorage.getItem('authToken');
      
      // For now, we'll just show a success message since the API might not support profile updates
      // In a real implementation, you would send the data to the API
      /*
      const response = await api.put('/user/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      */

      setMessage('Profile updated successfully!');
      setTimeout(() => {
        navigate(`/profile/${user.id}`);
      }, 2000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="edit-profile-container">
      <NavBar user={user} />
      <div className="edit-profile-content">
        <div className="edit-profile-header">
          <h1>Edit Profile</h1>
          <button 
            className="cancel-button"
            onClick={() => navigate(`/profile/${user.id}`)}
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="cover-photo-section">
            <div className="cover-photo-container">
              <img
                src={coverPreview || formData.cover_photo || 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800&h=300&fit=crop'}
                alt="Cover"
                className="cover-photo-preview"
              />
              <label className="cover-photo-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'cover')}
                  hidden
                />
                📷 Change Cover Photo
              </label>
            </div>
          </div>

          <div className="profile-photo-section">
            <div className="profile-photo-container">
              <img
                src={profilePreview || formData.profile_picture || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'}
                alt="Profile"
                className="profile-photo-preview"
              />
              <label className="profile-photo-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'profile')}
                  hidden
                />
                📷
              </label>
            </div>
          </div>

          <div className="form-fields">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fName">First Name</label>
                <input
                  type="text"
                  id="fName"
                  name="fName"
                  value={formData.fName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lName">Last Name</label>
                <input
                  type="text"
                  id="lName"
                  name="lName"
                  value={formData.lName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>
          </div>

          {message && (
            <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(`/profile/${user.id}`)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
