import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import MakePost from '../components/MakePost';
import PostFeed from '../components/PostFeed';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const [user, setUser] = useState(null);
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
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) {
    return <p>Loading...</p>; // optionally replace with a spinner
  }

  return (
    <div className="home-container">
      <NavBar user={user} /> {/* Pass user to NavBar */}
      <div className="feed-wrapper">
        <MakePost />
        <PostFeed />
      </div>
    </div>
  );
}