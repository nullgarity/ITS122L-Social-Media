import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import PostCard from '../components/PostCard';

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);

  const user = JSON.parse(localStorage.getItem('authUser'));

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    // simulate fetching from API or localStorage
    const allPosts = JSON.parse(localStorage.getItem('allPosts')) || [];
    const currentPost = allPosts.find(p => p.id === Number(id));
    setPost(currentPost);

    const storedReplies = JSON.parse(localStorage.getItem(`replies_${id}`)) || [];
    setReplies(storedReplies);
  }, [id]);

  const handleDeleteReply = (replyId) => {
    const updated = replies.filter(r => r.id !== replyId);
    setReplies(updated);
    localStorage.setItem(`replies_${id}`, JSON.stringify(updated));
  };

  const formatDate = (isoDate) => new Date(isoDate).toLocaleString();

  if (!post) return <div>Loading...</div>;

  return (
    <>
      <NavBar />
      <div className="post-page">
        <PostCard post={post} />
        <div className="reply-list">
          {replies.map(reply => (
            <div key={reply.id} className="reply-item">
              <div className="reply-info" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{reply.users?.fName} {reply.users?.lName}</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {reply.owned_by === user?.id && (
                      <button onClick={() => handleDeleteReply(reply.id)}>🗑️</button>
                    )}
                    <span style={{ fontSize: '14px', color: '#555' }}>{formatDate(reply.created_at)}</span>
                  </div>
                </div>
                <p>{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}