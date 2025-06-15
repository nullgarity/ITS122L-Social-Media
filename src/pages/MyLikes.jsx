import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import PostFeed from '../components/PostFeed';
import api from '../api/axios';

export default function MyLikes() {
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const res = await api.get('/posts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filtered = res.data.filter(post => post.liked_by_user === true);
        setLikedPosts(filtered);
      } catch (err) {
        console.error('Failed to fetch liked posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedPosts();
  }, []);

  return (
    <div>
      <NavBar />
      <h2>Posts You've Liked</h2>
      {loading ? (
        <p>Loading liked posts...</p>
      ) : likedPosts.length > 0 ? (
        <PostFeed posts={likedPosts} />
      ) : (
        <p className="no-posts-message">You haven’t liked any posts yet.</p>
      )}
    </div>
  );
}
