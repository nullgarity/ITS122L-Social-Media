import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReplyBox from './ReplyBox';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function PostCard({ post }) {
  const [user, setUser] = useState(null);
  const [liked, setLiked] = useState(false); // initial liked state can be improved by API data
  const [likes, setLikes] = useState(post.likes || 0);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${API_BASE}/user/${post.owned_by}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error('Failed to load user:', error);
      }
    }
    fetchUser();
  }, [post.owned_by]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('You must be logged in to like posts.');
        return;
      }
      const action = liked ? 'unlike' : 'like';
      const res = await fetch(`${API_BASE}/post/${post.id}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to update like status');
      setLiked(!liked);
      setLikes((prev) => prev + (liked ? -1 : 1));
    } catch (error) {
      console.error('Like/unlike failed:', error);
    }
  };

  const goToPost = () => {
    navigate(`/post/${post.id}`);
  };

  const formattedDate = new Date(post.created_at).toLocaleString();

  return (
    <div className="post-card" style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px' }}>
      <div className="post-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        {user ? (
          <>
            <img
              src={user.profile_picture || '/default-pfp.png'}
              alt={`${user.first_name} ${user.last_name}`}
              style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 10 }}
            />
            <div>
              <strong>{user.first_name} {user.last_name}</strong>
              <br />
              <small style={{ color: '#666' }}>{formattedDate}</small>
            </div>
          </>
        ) : (
          <span>Loading user...</span>
        )}
      </div>

      <div className="post-content" style={{ marginBottom: '10px' }}>
        <p>{post.content}</p>
      </div>

      <div className="post-actions" style={{ display: 'flex', alignItems: 'center' }}>
        <button onClick={handleLike} style={{ cursor: 'pointer' }}>
          {liked ? '❤️ Unlike' : '🤍 Like'} ({likes})
        </button>

        <button
          onClick={goToPost}
          style={{
            background: 'none',
            border: 'none',
            color: 'blue',
            textDecoration: 'underline',
            cursor: 'pointer',
            marginLeft: '15px',
          }}
        >
          View Replies ({post.replies?.length || 0})
        </button>
      </div>

      {/* Optional: If you want to keep ReplyBox here too */}
      {/* <ReplyBox postId={post.id} /> */}
    </div>
  );
}