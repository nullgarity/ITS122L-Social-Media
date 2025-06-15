// src/components/ReplyItem.jsx
import React from 'react';
import './ReplyItem.css';

export default function ReplyItem({ reply, user }) {
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString();
  };

  return (
    <div className="reply-card">
      <img
        className="reply-avatar"
        src={user?.profile_picture || 'https://i.pinimg.com/474x/e6/e4/df/e6e4df26ba752161b9fc6a17321fa286.jpg'}
        alt="Profile"
      />
      <div className="reply-content-block">
        <div className="reply-header">
          <strong>{user ? `${user.first_name} ${user.last_name}` : 'Loading...'}</strong>
          <span className="reply-date">{formatDate(reply.created_at)}</span>
        </div>
        <div className="reply-body">{reply.content}</div>
      </div>
    </div>
  );
}
