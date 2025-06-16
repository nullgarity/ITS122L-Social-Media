import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PostCard.css';
import defaultProfilePic from '../assets/default-profile.png';

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  const {
    id,
    content,
    created_at,
    user = { fName: 'Unknown', lName: 'User', profilePicture: defaultProfilePic },
    likes = [],
    commentsCount = 0,
  } = post;

  useEffect(() => {
    console.log('Rendering post:', id, 'by', user?.fName, user?.lName);
  }, [id, user]);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(
    typeof likes === 'object' && likes.count !== undefined
      ? likes.count
      : Array.isArray(likes)
        ? likes.length
        : likes || 0
  );

  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    setLiked(likedPosts.includes(id));
  }, [id]);

  const updateLocalStorage = (postId, like) => {
    let likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    likedPosts = like
      ? [...new Set([...likedPosts, postId])]
      : likedPosts.filter(pid => pid !== postId);
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
  };

  const handleLike = async () => {
    try {
      await axios.post(
        `https://supabase-socmed.vercel.app/post/${id}/likes`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLiked(true);
      setLikeCount(prev => prev + 1);
      updateLocalStorage(id, true);
    } catch (err) {
      if (err.response?.status === 409) {
        console.warn('Already liked');
      } else {
        console.error('Error liking post:', err);
      }
    }
  };

  const handleUnlike = async () => {
    try {
      await axios.delete(
        `https://supabase-socmed.vercel.app/post/${id}/likes`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLiked(false);
      setLikeCount(prev => Math.max(prev - 1, 0));
      updateLocalStorage(id, false);
    } catch (err) {
      console.error('Error unliking post:', err);
    }
  };

  const handleToggleLike = () => {
    liked ? handleUnlike() : handleLike();
  };

  const handleNavigateToPost = () => {
    navigate(`/post/${id}`);
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-author-left">
          <img
            src={user.profilePicture || defaultProfilePic}
            alt="Profile"
            className="post-author-pic"
          />
          <div className="post-author-info">
            <strong>{user.fName} {user.lName}</strong>
          </div>
        </div>
        <div className="post-date clickable" onClick={handleNavigateToPost}>
          {new Date(created_at).toLocaleString()}
        </div>
      </div>

      <div className="post-content">{content}</div>

    <div className="post-actions">
      <div
        className={`segment clickable ${liked ? 'liked' : ''}`}
        onClick={handleToggleLike}
      >
        {liked ? '💔 Unlike' : '❤️ Like'} ({likeCount})
      </div>
      <div className="segment clickable" onClick={handleNavigateToPost}>
        💬 Comment ({commentsCount})
      </div>
    </div>

    </div>
  );
};

export default PostCard;