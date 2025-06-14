import React, { useState } from 'react';
import './ReplyBox.css';

export default function ReplyBox({ postId }) {
  const [reply, setReply] = useState('');

  const handlePostReply = () => {
    if (!reply.trim()) return;

    // Send reply logic here...

    setReply('');
  };

  return (
    <div className="reply-box">
      <div className="reply-box-top">
        <img
          src="https://via.placeholder.com/36" // Replace with logged-in user's profile pic
          alt="User"
          className="reply-profile-pic"
        />
        <textarea
          className="reply-textarea"
          rows={2}
          placeholder="Write a reply..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />
      </div>
      <button className="reply-post-button" onClick={handlePostReply}>
        Post
      </button>
    </div>
  );
}