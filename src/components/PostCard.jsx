import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PostCard.css';

const PostCard = ({ post, onCommentClick }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  const [liked, setLiked] = useState(false);
  // FIX: Handle both object ({ count: number }) and number cases for post.likes
  const [likeCount, setLikeCount] = useState(
    typeof post.likes === 'object' ? post.likes.count : post.likes || 0
  );

  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    setLiked(likedPosts.includes(post.id));
  }, [post.id]);

  const updateLocalStorage = (postId, like) => {
    let likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    likedPosts = like
      ? [...new Set([...likedPosts, postId])]
      : likedPosts.filter(id => id !== postId);
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
  };

  const handleLike = async () => {
    try {
      await axios.patch(
        `https://supabase-socmed.vercel.app/post/${post.id}/likes`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLiked(true);
      setLikeCount(prev => prev + 1);
      updateLocalStorage(post.id, true);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleUnlike = async () => {
    try {
      await axios.delete(
        `https://supabase-socmed.vercel.app/post/${post.id}/likes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLiked(false);
      setLikeCount(prev => prev - 1);
      updateLocalStorage(post.id, false);
    } catch (err) {
      console.error('Error unliking post:', err);
    }
  };

  const handleToggleLike = () => {
    liked ? handleUnlike() : handleLike();
  };

  const handleDateClick = () => {
    navigate(`/post/${post.id}`);
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-author-left">
          <img
            src={post.user.profilePicture}
            alt="Profile"
            className="post-author-pic"
          />
          <div className="post-author-info">
            <strong>{post.user.fName} {post.user.lName}</strong>
          </div>
        </div>
        <div className="post-date clickable" onClick={handleDateClick}>
          {new Date(post.created_at).toLocaleString()}
        </div>
      </div>

      <div className="post-content">{post.content}</div>

      <div className="post-actions">
        <div className="segment" onClick={handleToggleLike}>
          {liked ? 'Unlike' : 'Like'} ({likeCount})
        </div>
        <div className="segment clickable" onClick={() => onCommentClick?.(post.id)}>
          Comments ({typeof post.commentsCount === 'number' ? post.commentsCount : 0})
        </div>
      </div>

      <div className="reply-button-container">
        <button onClick={() => onCommentClick?.(post.id)}>Reply</button>
      </div>
    </div>
  );
};

export default PostCard;