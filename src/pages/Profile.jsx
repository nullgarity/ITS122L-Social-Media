import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import PostBox from '../components/PostBox';
import defaultProfilePic from '../assets/default-profile.png';
import '../components/PostFeed.css';
import ReplyFeed from '../components/ReplyFeed';

export default function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) navigate('/login');
  }, [navigate]);

  // Fetch current user info from localStorage or API
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const cached = localStorage.getItem('current_user');
        if (cached) {
          setCurrentUser(JSON.parse(cached));
        } else {
          const token = localStorage.getItem('access_token');
          const res = await api.get('/user', {
            headers: { Authorization: `Bearer ${token}` },
          });

          const profilePicture = res.data.profile_picture?.startsWith('/uploads')
            ? `https://supabase-socmed.vercel.app${res.data.profile_picture}`
            : (res.data.profile_picture || defaultProfilePic);

          const user = {
            id: res.data.id,
            fName: res.data.fName,
            lName: res.data.lName,
            profilePicture,
          };

          localStorage.setItem('current_user', JSON.stringify(user));
          setCurrentUser(user);
        }
      } catch (err) {
        console.error('Failed to load current user:', err);
      }
    };

    loadCurrentUser();
  }, []);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const postRes = await api.get(`/post?page=${page + 1}&limit=11`);
        const fetchedPosts = postRes.data || [];
        const postsToShow = fetchedPosts.slice(0, 10);

        const postsWithUserInfo = postsToShow.map((post) => {
          let user;

          // Use currentUser if it's your post
          if (currentUser && post.owned_by === currentUser.id) {
            user = {
              fName: currentUser.fName,
              lName: currentUser.lName,
              profilePicture: currentUser.profilePicture || defaultProfilePic,
            };
          } else {
            user = {
              fName: 'Unknown',
              lName: 'User',
              profilePicture: defaultProfilePic,
            };
          }

          if (user.profilePicture.startsWith('/uploads')) {
            user.profilePicture = `https://supabase-socmed.vercel.app${user.profilePicture}`;
          }

          let commentsCount = 0;
          if (Array.isArray(post.replies)) {
            commentsCount = post.replies.length;
          } else if (post.replies?.count !== undefined) {
            commentsCount = post.replies.count;
          }

          return {
            ...post,
            user,
            commentsCount,
          };
        });

        postsWithUserInfo.sort((a, b) => b.id - a.id);
        setPosts(postsWithUserInfo);
        setHasMore(fetchedPosts.length === 11);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setPosts([]);
        setHasMore(false);
      }

      setLoading(false);
    };

    if (currentUser) {
      fetchPosts();
    }
  }, [page, currentUser]);

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () => hasMore && setPage((prev) => prev + 1);

  const handleShowReplies = async (postId) => {
    setSelectedPostId(postId);
    setLoadingReplies(true);
    try {
      const res = await api.get(`/post/${postId}`);
      setReplies(res.data.replies || []);
    } catch (err) {
      console.error('Failed to fetch replies:', err);
      setReplies([]);
    }
    setLoadingReplies(false);
  };

  const handleNewPost = async (newPost) => {
    const token = localStorage.getItem('access_token');
    try {
      const res = await api.get('/user', {
        headers: { Authorization: `Bearer ${token}` },
      });

      let profilePicture = res.data.profile_picture || defaultProfilePic;
      if (profilePicture.startsWith('/uploads')) {
        profilePicture = `https://supabase-socmed.vercel.app${profilePicture}`;
      }

      const user = {
        id: res.data.id,
        fName: res.data.fName,
        lName: res.data.lName,
        profilePicture,
      };

      // Cache for future reloads
      localStorage.setItem('current_user', JSON.stringify(user));
      setCurrentUser(user);

      setPosts((prev) => [
        {
          ...newPost,
          owned_by: user.id,
          user,
          commentsCount: 0,
        },
        ...prev,
      ]);
    } catch (err) {
      console.error('❌ Failed to fetch current user info:', err.response?.data || err.message);
      setPosts((prev) => [
        {
          ...newPost,
          user: {
            fName: 'Unknown',
            lName: 'User',
            profilePicture: defaultProfilePic,
          },
          commentsCount: 0,
        },
        ...prev,
      ]);
    }
  };

  return (
    <div className="post-feed-container">
      <PostBox onPostCreated={handleNewPost} />
      {loading ? (
        <p className="no-posts-message">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="no-posts-message">No posts found.</p>
      ) : (
        <>
          {posts.map((post) => (
            <div key={post.id}>
              <PostCard
                post={post}
                onCommentClick={() => handleShowReplies(post.id)}
              />
              {selectedPostId === post.id && (
                <div>
                  {loadingReplies ? (
                    <div style={{ padding: '1rem' }}>Loading replies...</div>
                  ) : !replies || replies.length === 0 ? (
                    <div style={{ padding: '1rem', color: '#777', fontStyle: 'italic' }}>
                      Be the first to comment.
                    </div>
                  ) : (
                    <ReplyFeed replies={replies} />
                  )}
                </div>
              )}
            </div>
          ))}
          <div className="post-feed-pagination">
            <button onClick={handlePrev} disabled={page === 0}>
              Previous
            </button>
            <span>Page {page + 1}</span>
            <button onClick={handleNext} disabled={!hasMore}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
