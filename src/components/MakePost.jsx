import React, { useState } from 'react';
import axios from '../api/axios'; // adjust path if needed
import './MakePost.css';

export default function MakePost({ onPostCreated }) {
  const [content, setContent] = useState('');

  const handlePost = async () => {
    if (!content.trim()) return;

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('You must be logged in to post.');
      return;
    }

    try {
      const response = await axios.post(
        '/post/create',
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContent('');
      if (onPostCreated) {
        onPostCreated(response.data); // send new post to parent
      }
    } catch (err) {
      console.error('Post failed:', err);
      alert('Post failed.');
    }
  };

  return (
    <div className="make-post-card">
      <textarea
        className="make-post-input"
        rows={3}
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button className="make-post-button" onClick={handlePost}>
        Post
      </button>
    </div>
  );
}