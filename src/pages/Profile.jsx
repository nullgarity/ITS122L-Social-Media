import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import PostBox from '../components/PostBox';
import defaultProfilePic from '../assets/default-profile.png';
import '../components/PostFeed.css';
import ReplyFeed from '../components/ReplyFeed';
import NavBar from '../components/NavBar';

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
    // Fetch ALL posts from all pages, then filter by user
    const fetchAllPosts = async () => {
      setLoading(true);
      let allPosts = [];
      let pageNum = 1;
      let keepFetching = true;
      const PAGE_LIMIT = 50;
      const MAX_PAGES = 100; 

      try {
        while (keepFetching && pageNum <= MAX_PAGES) {
          const res = await api.get(`/post?page=${pageNum}&limit=${PAGE_LIMIT}`);
          const posts = res.data || [];
          if (posts.length === 0) {
            keepFetching = false;
          } else {
            allPosts = allPosts.concat(posts);
            pageNum += 1;
          }
        }
        // Filter to only current user's posts
        const userPosts = currentUser
          ? allPosts.filter(post => post.owned_by === currentUser.id)
          : [];

        
        const postsWithUserInfo = userPosts.map((post) => {
          let user;
          if (post.user && post.user.fName && post.user.lName) {
            user = {
              fName: post.user.fName,
              lName: post.user.lName,
              profilePicture:
                post.user.profile_picture ||
                post.user.profilePicture ||
                defaultProfilePic,
            };
          } else if (currentUser && post.owned_by === currentUser.id) {
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
          if (
            user.profilePicture &&
            user.profilePicture.startsWith('/uploads')
          ) {
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
        setHasMore(postsWithUserInfo.length > (page + 1) * 10);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setPosts([]);
        setHasMore(false);
      }
      setLoading(false);
    };

    if (currentUser) {
      fetchAllPosts();
    }
    // eslint-disable-next-line
  }, [currentUser]);

  // Update hasMore when page or posts change
  useEffect(() => {
    setHasMore(posts.length > (page + 1) * 10);
  }, [page, posts]);

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
    <>
      <NavBar user={currentUser} />
      <div className="post-feed-container">
        <PostBox onPostCreated={handleNewPost} />
        {loading ? (
          <p className="no-posts-message">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="no-posts-message">No posts found.</p>
        ) : (
          <>
            {posts.slice(page * 10, (page + 1) * 10).map((post) => (
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
    </>
  );
}
