import React from 'react';
import './PostCard.css';
import ReplyBox from './ReplyBox';

export default function PostCard({ post }) {
  const { owner, text, publishDate, replyCount = 0 } = post;

  const formattedDate = new Date(publishDate).toLocaleString();

  return (
    <div className="post-card">
      {/* User Info */}
      <div className="post-header">
        <div className="user-info">
          <img src={owner.picture} alt="Profile" className="profile-pic" />
          <span className="user-name">{owner.firstName} {owner.lastName}</span>
        </div>
        <div className="post-date">{formattedDate}</div>
      </div>

      {/* Post Content */}
      <div className="post-content">
        {text}
      </div>

      {/* Reply Count */}
      <div className="reply-count">
        {replyCount} {replyCount === 1 ? 'Reply' : 'Replies'}
      </div>

      {/* Reply Box */}
      <ReplyBox postId={post.id} />
    </div>
  );
}