import React from 'react';
import './PostCard.css'; // You can style this file separately
import { useNavigate } from 'react-router-dom';

const PostCard = ({ post }) => {
  const navigate = useNavigate();

  const handleCommentClick = () => {
    navigate(`/post/${post.id}`);
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString(); // e.g., "6/15/2025, 10:33:15 PM"
  };

  return (
    <div className="post-card">
      <div className="post-header">
        {/* Since you only have owned_by UUID, no names/pics unless you fetch user info elsewhere */}
        <div className="post-author">User ID: {post.owned_by}</div>
        <div
          className="post-date clickable"
          onClick={() => navigate(`/post/${post.id}`)}
        >
          {formatDate(post.created_at)}
        </div>
      </div>

      <div className="post-content">
        {post.content}
      </div>

      <div className="post-actions">
        <span>❤️ {post.likes?.[0]?.count ?? 0}</span>
        <span className="clickable" onClick={handleCommentClick}>
          💬 Comments ({post.replies?.[0]?.count ?? 0})
        </span>
      </div>
    </div>
  );
};

export default PostCard;