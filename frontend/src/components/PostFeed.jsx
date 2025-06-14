import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';
import './PostFeed.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const POSTS_PER_PAGE = 10;

  useEffect(() => {
    loadPosts(page);
  }, [page]);

  const loadPosts = async (pageNum) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No access token found');
        return;
      }

      const response = await fetch(`${API_BASE}/post?page=${pageNum}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch posts:', response.statusText);
        return;
      }

      const data = await response.json();

      if (data.length < POSTS_PER_PAGE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="post-feed-container">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      <div className="post-feed-pagination">
          <button onClick={handlePrev} disabled={page <= 1}>Previous</button>
          <button onClick={handleNext} disabled={!hasMore}>Next</button>
      </div>
    </div>
  );
}