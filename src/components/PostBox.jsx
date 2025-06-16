import React, { useState } from 'react';
import axios from '../api/axios';
import './PostBox.css';
import defaultProfilePic from '../assets/default-profile.png';

export default function PostBox({ onPostCreated }) {
  const [content, setContent] = useState('');

  const handlePost = async () => {
    if (!content.trim()) return;

    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const formData = new URLSearchParams();
      formData.append('content', content);

      const response = await axios.post(
        '/post',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      console.log('✅ New post response:', response.data[0]); // ERROR LOGGING

      setContent('');

      const newPost = response.data[0];

      if (newPost && onPostCreated) {
        try {
          const userRes = await axios.get(`/user/${newPost.owned_by}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          newPost.user = {
            fName: userRes.data.fName,
            lName: userRes.data.lName,
            profilePicture: userRes.data.profile_picture || defaultProfilePic,
          };

          newPost.commentsCount = 0;

          onPostCreated(newPost);
        } catch (userErr) {
          console.error('Failed to fetch user for new post:', userErr?.response?.data || userErr.message);
        }
      }
    } catch (err) {
      console.error('Post failed:', err?.response?.data || err.message);
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
      <button
        className="make-post-button"
        onClick={handlePost}
        disabled={!content.trim()}
      >
        Post
      </button>
    </div>
  );
}