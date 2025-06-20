import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar';
import PostCard from '../components/PostCard';
import ReplyFeed from '../components/ReplyFeed';
import ReplyBox from '../components/ReplyBox';
import defaultProfilePic from '../assets/default-profile.png';
import './Post.css';

export default function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  const currentUserId = localStorage.getItem('user_id');

  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [user, setUser] = useState(null);

  const fetchPost = async () => {
    try {
      const res = await axios.get(`https://supabase-socmed.vercel.app/post/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;

      // Get local user info
      const localUser = JSON.parse(localStorage.getItem('current_user') || '{}');
      const userId = localUser?.id || localStorage.getItem('user_id');

      // Patch post user if missing and owned by current user
      let patchedPost = {
        ...data,
        likes: Array.isArray(data.likes) ? data.likes.length : 0,
        commentsCount: Array.isArray(data.replies) ? data.replies.length : 0,
      };
      if (
        String(data.owned_by) === String(userId) &&
        (!data.user || Object.keys(data.user).length === 0)
      ) {
        patchedPost.user = {
          fName: localUser.fName,
          lName: localUser.lName,
          profilePicture:
            localUser.profilePicture ||
            "https://i.pinimg.com/474x/e6/e4/df/e6e4df26ba752161b9fc6a17321fa286.jpg",
        };
      }

      setPost(patchedPost);

      
      const patchedReplies = (data.replies || []).map((reply) =>
        String(reply.owned_by) === String(userId) &&
        (!reply.user || Object.keys(reply.user).length === 0)
          ? {
              ...reply,
              user: {
                fName: localUser.fName,
                lName: localUser.lName,
                profilePicture:
                  localUser.profilePicture ||
                  "https://i.pinimg.com/474x/e6/e4/df/e6e4df26ba752161b9fc6a17321fa286.jpg",
              },
            }
          : reply
      );

      setReplies(patchedReplies);
    } catch (err) {
      console.error('Error fetching post:', err);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get('https://supabase-socmed.vercel.app/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error('Error fetching user:', err);
      navigate('/login');
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUser();
    fetchPost();
  }, [id]);

  const handleReplySuccess = async () => {
    await fetchPost();
  };

  const handleDeleteReply = async (replyId) => {
    try {
      await axios.delete(
        `https://supabase-socmed.vercel.app/post/${id}/replies/${replyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplies((prev) => prev.filter((reply) => reply.id !== replyId));
    } catch (err) {
      console.error('Error deleting reply:', err);
    }
  };

  if (!user)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="post-container">
      <NavBar user={user} />
      <div className="post-wrapper">
        {post && (
          <>
            <PostCard post={post} showActions={false} />
            <ReplyBox postId={id} onReplySuccess={handleReplySuccess} />
            <ReplyFeed
              replies={replies}
              currentUserId={String(currentUserId)}
              onDelete={handleDeleteReply}
            />
          </>
        )}
      </div>
    </div>
  );
}