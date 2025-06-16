import React, { useState } from 'react';
import axios from 'axios';

export default function ReplyBox({ postId, onReplySuccess }) {
  const [content, setContent] = useState('');
  const token = localStorage.getItem('access_token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await axios.post(
        `https://supabase-socmed.vercel.app/post/${postId}/replies`,
        new URLSearchParams({ content }),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent('');
      onReplySuccess();
    } catch (err) {
      console.error('Error posting reply:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="reply-box">
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Write a reply..."
        required
        className="make-post-input"
        rows={3}
        style={{ resize: 'none', fontSize: '16px', fontFamily: 'inherit' }}
      />
      <div style={{ textAlign: 'right' }}>
        <button type="submit" className="make-post-button">Reply</button>
      </div>
    </form>
  );
}