import React, { useEffect, useState } from 'react';
import axios from '../api/axios'; // or adjust path
import PostCard from './PostCard';
import './PostFeed.css';

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
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token');
        return;
      }

      const response = await axios.get(`/post`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: pageNum,
        },
      });

      const data = response.data;

      if (data.length < POSTS_PER_PAGE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
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
        <button onClick={handlePrev} disabled={page <= 1}>
          Previous
        </button>
        <button onClick={handleNext} disabled={!hasMore}>
          Next
        </button>
      </div>
    </div>
  );
}