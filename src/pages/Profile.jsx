import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ import this
import NavBar from '../components/NavBar';
import api from '../api/axios';
import './Profile.css';
import defaultProfilePic from '../assets/default-profile.png';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate(); // ✅ initialize navigator

  useEffect(() => {
    const fetchOwnProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          navigate('/login'); // ✅ redirect if no token
          return;
        }

        const res = await api.get('/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data && res.data.id) {
          setUser(res.data);
        } else {
          console.error('Invalid user data:', res.data);
          navigate('/login'); // ✅ redirect if user data is invalid
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        navigate('/login'); // ✅ redirect on error
      } finally {
        setLoading(false);
      }
    };

    fetchOwnProfile();
  }, [navigate]);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('profile', file);
    setUploading(true);

    try {
      const token = localStorage.getItem('access_token');
      const res = await api.patch('/user/profile-picture', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data && Array.isArray(res.data) && res.data[0]) {
        setUser(res.data[0]);
      } else {
        alert('Failed to update profile picture.');
      }
    } catch (err) {
      console.error('Upload error:', err?.response?.data || err.message || err);
      alert('Failed to upload profile picture.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div>
      <NavBar user={user} />
      <div className="profile-container">
        <div className="profile-card">
          <img
            src={user?.profile_picture || defaultProfilePic}
            alt="Profile"
            className="profile-picture"
          />
          <h2>{user?.fName} {user?.lName}</h2>
          <p className="join-date">
            Joined: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
          </p>

          <div style={{ marginTop: '1rem' }}>
            <label htmlFor="profile-upload" className="upload-btn">
              {uploading ? 'Uploading...' : 'Change Profile Picture'}
            </label>
            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              onChange={handleProfilePicChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}