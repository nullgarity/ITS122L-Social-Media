import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import ReplyBox from '../components/ReplyBox';
import api from '../api/axios';
import './Post.css';

export default function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch current user
        const userRes = await api.get('/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(userRes.data);

        // Fetch post details
        const postRes = await api.get(`/post/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPost(postRes.data);

        // Fetch comments (mock data for now)
        const mockComments = [
          {
            id: 1,
            content: 'Great post! Thanks for sharing.',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            user: {
              id: 'user-1',
              fName: 'John',
              lName: 'Doe',
              profile_picture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'
            }
          },
          {
            id: 2,
            content: 'I completely agree with this!',
            created_at: new Date(Date.now() - 1800000).toISOString(),
            user: {
              id: 'user-2',
              fName: 'Jane',
              lName: 'Smith',
              profile_picture: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'
            }
          }
        ];
        setComments(mockComments);
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch post:', err);
        setError('Failed to load post. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString();
  };

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleCommentAdded = (newComment) => {
    setComments(prev => [...prev, newComment]);
  };

  if (loading) {
    return (
      <div className="post-page-container">
        <div className="loading">Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-page-container">
        <NavBar user={user} />
        <div className="post-page-content">
          <div className="error">{error || 'Post not found.'}</div>
          <button className="back-button" onClick={() => navigate('/home')}>
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="post-page-container">
      <NavBar user={user} />
      <div className="post-page-content">
        <div className="post-detail-card">
          <div className="post-header">
            <div className="post-author-info" onClick={() => handleProfileClick(post.users?.id)}>
              <img
                src={post.users?.profile_picture || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'}
                alt="Profile"
                className="post-author-avatar"
              />
              <div className="post-author-details">
                <div className="post-author-name">
                  {post.users ? `${post.users.fName} ${post.users.lName}` : 'Unknown User'}
                </div>
                <div className="post-date">
                  {formatDate(post.created_at)}
                </div>
              </div>
            </div>
          </div>

          <div className="post-content">
            {post.content}
          </div>

          <div className="post-stats">
            <span className="post-stat">
              {post.likes?.[0]?.count ?? 0} reactions
            </span>
            <span className="post-stat">
              {comments.length} comments
            </span>
          </div>

          <div className="post-actions">
            <button className="action-button like-button">
              👍 Like
            </button>
            <button className="action-button comment-button">
              💬 Comment
            </button>
            <button className="action-button share-button">
              📤 Share
            </button>
          </div>
        </div>

        <div className="comments-section">
          <h3>Comments</h3>
          
          <ReplyBox postId={post.id} onCommentAdded={handleCommentAdded} />
          
          <div className="comments-list">
            {comments.length === 0 ? (
              <div className="no-comments">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <img
                      src={comment.user.profile_picture}
                      alt="Profile"
                      className="comment-avatar"
                      onClick={() => handleProfileClick(comment.user.id)}
                    />
                    <div className="comment-info">
                      <div className="comment-author" onClick={() => handleProfileClick(comment.user.id)}>
                        {comment.user.fName} {comment.user.lName}
                      </div>
                      <div className="comment-date">
                        {formatDate(comment.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="comment-content">
                    {comment.content}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
