import React, { useState } from 'react';
import './PostCard.css';
import { useNavigate } from 'react-router-dom';
import ReactionPicker from './ReactionPicker';

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const [showReactions, setShowReactions] = useState(false);

  const handleCommentClick = () => {
    navigate(`/post/${post.id}`);
  };

  const handleProfileClick = () => {
    if (post.users?.id) {
      navigate(`/profile/${post.users.id}`);
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString();
  };

  const formatContent = (content) => {
    if (content.length > 300) {
      return content.substring(0, 300) + '...';
    }
    return content;
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-author-info" onClick={handleProfileClick}>
          <img
            src={post.users?.profile_picture || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'}
            alt="Profile"
            className="post-author-avatar"
          />
          <div className="post-author-details">
            <div className="post-author-name">
              {post.users ? `${post.users.fName} ${post.users.lName}` : 'Unknown User'}
            </div>
            <div
              className="post-date clickable"
              onClick={() => navigate(`/post/${post.id}`)}
            >
              {formatDate(post.created_at)}
            </div>
          </div>
        </div>
      </div>

      <div className="post-content">
        {formatContent(post.content)}
        {post.content.length > 300 && (
          <span className="read-more" onClick={() => navigate(`/post/${post.id}`)}>
            Read more
          </span>
        )}
      </div>

      <div className="post-stats">
        <span className="post-stat">
          {post.likes?.[0]?.count ?? 0} reactions
        </span>
        <span className="post-stat">
          {post.replies?.[0]?.count ?? 0} comments
        </span>
      </div>

      <div className="post-actions">
        <div className="reaction-container">
          <button 
            className="action-button like-button"
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setShowReactions(false)}
          >
            👍 Like
          </button>
          {showReactions && (
            <ReactionPicker 
              postId={post.id} 
              onReactionSelect={() => setShowReactions(false)}
            />
          )}
        </div>
        <button className="action-button comment-button" onClick={handleCommentClick}>
          💬 Comment
        </button>
        <button className="action-button share-button">
          📤 Share
        </button>
      </div>
    </div>
  );
};

export default PostCard;
