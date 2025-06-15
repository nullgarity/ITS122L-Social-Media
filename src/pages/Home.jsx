// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import NavBar from '../components/NavBar';
import MakePost from '../components/MakePost';
import PostFeed from '../components/PostFeed';

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.warn('No token in localStorage');
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get('/user');
        console.log('Fetched user:', res.data);
        if (res.data && res.data.email) {
          setUser(res.data);
        } else {
          console.warn('Invalid user data received:', res.data);
          navigate('/login');
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
        navigate('/login'); // only if you want to auto-kick on error
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) return <p>Loading...</p>;

  return (
    <>
      <NavBar user={user} />
      <div className="container">
        <MakePost user={user} />
        <PostFeed user={user} />
      </div>
    </>
  );
}

export default Home;