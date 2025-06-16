// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import NavBar from '../components/NavBar';
import PostFeed from '../components/PostFeed';

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.warn('No token found — redirecting to login');
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

        let userData = res.data;

        // Normalize profilePicture if needed
        if (userData.profilePicture?.startsWith('/uploads')) {
          userData.profilePicture = `https://supabase-socmed.vercel.app${userData.profilePicture}`;
        }

        // Fallback to default profile picture
        if (!userData.profilePicture || userData.profilePicture.trim() === '') {
          userData.profilePicture = "https://i.pinimg.com/474x/e6/e4/df/e6e4df26ba752161b9fc6a17321fa286.jpg";
        }

        if (userData?.email) {
          setUser(userData);
        } else {
          console.warn('Invalid user data:', userData);
          navigate('/login');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <NavBar user={user} />
      <div className="container">
        <PostFeed user={user} />
      </div>
    </>
  );
}

export default Home;