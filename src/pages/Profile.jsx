import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import ProfileDetails from '../components/ProfileDetails';
import PostFeed from '../components/PostFeed';
import MakePost from '../components/MakePost';
import api from '../api/axios';
import './Profile.css';

export default function Profile() {
  const { id } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('Please log in to view profiles');
          setLoading(false);
          return;
        }

        // Fetch current user
        const currentUserRes = await api.get('/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUser(currentUserRes.data);

        // For now, we'll use the current user data for the profile
        // In a real implementation, you would fetch the specific user by ID
        if (id === currentUserRes.data.id || !id) {
          setProfileUser(currentUserRes.data);
        } else {
          // Mock data for other users since API might not support fetching other users yet
          setProfileUser({
            id: id,
            fName: 'John',
            lName: 'Doe',
            email: 'john.doe@example.com',
            bio: 'Hello! I\'m John. I love sharing moments and connecting with friends.',
            profile_picture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
            cover_photo: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop',
            created_at: '2024-01-15T10:30:00Z'
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
        setError('Failed to load profile. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!profileUser || !currentUser) {
    return (
      <div className="profile-container">
        <div className="error">Profile not found.</div>
      </div>
    );
  }

  const isOwnProfile = profileUser.id === currentUser.id;

  return (
    <div className="profile-container">
      <NavBar user={currentUser} />
      <div className="profile-content">
        <ProfileDetails 
          user={profileUser} 
          isOwnProfile={isOwnProfile}
        />
        
        <div className="profile-timeline">
          <div className="timeline-header">
            <h2>Timeline</h2>
          </div>
          
          {isOwnProfile && (
            <div className="timeline-post-section">
              <MakePost />
            </div>
          )}
          
          <div className="timeline-posts">
            <PostFeed userId={profileUser.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
