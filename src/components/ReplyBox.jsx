import React, { useState } from 'react';
import './ReplyBox.css';
import api from '../api/axios';

export default function ReplyBox({ postId, onCommentAdded }) {
  const [reply, setReply] = useState('');
  const [posting, setPosting] = useState(false);

  const handlePostReply = async () => {
    if (!reply.trim()) return;

    setPosting(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('You must be logged in to comment.');
        return;
      }

      // For now, we'll create a mock comment since the API might not support comments yet
      const mockComment = {
        id: Date.now(),
        content: reply,
        created_at: new Date().toISOString(),
        user: {
          id: 'current-user',
          fName: 'You',
          lName: '',
          profile_picture: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'
        }
      };

      // In a real implementation, you would make an API call like:
      // const response = await api.post(`/post/${postId}/comment`, {
      //   content: reply
      // }, {
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   }
      // });

      if (onCommentAdded) {
        onCommentAdded(mockComment);
      }

      setReply('');
    } catch (error) {
      console.error('Failed to post comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePostReply();
    }
  };

  return (
    <div className="reply-box">
      <div className="reply-box-top">
        <img
          src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=36&h=36&fit=crop"
          alt="Your profile"
          className="reply-profile-pic"
        />
        <div className="reply-input-container">
          <textarea
            className="reply-textarea"
            rows={2}
            placeholder="Write a comment..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={posting}
          />
          <button 
            className="reply-post-button" 
            onClick={handlePostReply}
            disabled={!reply.trim() || posting}
          >
            {posting ? '⏳' : '📤'}
          </button>
        </div>
      </div>
    </div>
  );
}
