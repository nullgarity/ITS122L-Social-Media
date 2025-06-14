import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import './Profile.css';

export default function Profile() {
  const { id } = useParams(); // Get :id from the URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/get-user.php?id=${id}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          console.error('Error fetching user:', data.message);
        }
      } catch (err) {
        console.error('Network error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <div>Loading profile...</div>;
  if (!user) return <div>User not found.</div>;

  return (
    <div>
      <NavBar />
      <div className="profile-container">
        <div className="profile-card">
          <img
            src={user.profile_picture || '/default-profile.png'}
            alt="Profile"
            className="profile-picture"
          />
          <h2>{user.fName} {user.lName}</h2>
          <p className="join-date">
            Joined: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}