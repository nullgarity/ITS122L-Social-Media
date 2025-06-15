import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import PostCard from './PostCard';
import ReplyFeed from './ReplyFeed';
import './PostFeed.css';
// This component fetches and displays a paginated list of posts with user information and replies.
export default function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [loading, setLoading] = useState(false); // loading state for posts

  // This state is used to indicate if the posts are currently being fetched.
  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      setLoading(true);
      setSelectedPostId(null);
      setReplies([]);
      const token = localStorage.getItem('access_token');
      if (!token) {
        setPosts([]);
        setLoading(false);
        return;
      }

      try {
        // backend API call to fetch posts. added + 1 to align index of backend api with frontend pagination.
        const postRes = await api.get(`/post?page=${page + 1}&limit=11`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedPosts = postRes.data || [];
        const postsToShow = fetchedPosts.slice(0, 10);

        const userRes = await api.get('/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allUsers = Array.isArray(userRes.data)
          ? userRes.data
          : userRes.data.users || [];

        const userMap = {};
        allUsers.forEach((user) => {
          userMap[user.id] = {
            fName: user.fName,
            lName: user.lName,
            profilePicture: user.profile_picture ||
              'https://i.pinimg.com/474x/e6/e4/df/e6e4df26ba752161b9fc6a17321fa286.jpg',
          };
        });

        const postsWithUser = postsToShow.map(post => {
          let commentsCount = 0;
          if (Array.isArray(post.replies)) {
            commentsCount = post.replies.length;
          } else if (typeof post.replies === 'object' && post.replies !== null && 'count' in post.replies) {
            commentsCount = post.replies.count;
          }

          return {
            ...post,
            user: userMap[post.userId] || {
              fName: 'Unknown',
              lName: 'User',
              profilePicture:
                'https://i.pinimg.com/474x/e6/e4/df/e6e4df26ba752161b9fc6a17321fa286.jpg',
            },
            commentsCount,
          };
        });

        setPosts(postsWithUser);
        setHasMore(fetchedPosts.length === 11);
      } catch (err) {
        console.error('Error fetching posts/users:', err);
        setPosts([]);
        setHasMore(false);
      }
      setLoading(false);
    };

    fetchPostsAndUsers();
  }, [page]);

  const handlePrev = () => {
    if (page > 0) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (hasMore) setPage((prev) => prev + 1);
  };

  const handleShowReplies = async (postId) => {
    setSelectedPostId(postId);
    setLoadingReplies(true);
    try {
      const res = await api.get(`/post/${postId}`);
      setReplies(res.data.replies || []);
    } catch (err) {
      setReplies([]);
      console.error('Failed to fetch replies:', err);
    }
    setLoadingReplies(false);
  };

  return (
    <div className="post-feed-container">
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
                  ) : (
                    (!replies || replies.length === 0 ||
                      (replies.length === 1 && replies[0] && replies[0].count === 0)
                    ) ? (
                      <div style={{ padding: '1rem', color: '#777', fontStyle: 'italic' }}>
                        Be the first to comment.
                      </div>
                    ) : (
                      <ReplyFeed replies={replies} />
                    )
                  )}
                </div>
              )}
            </div>
          ))}

          <div className="post-feed-pagination">
            <button onClick={handlePrev} disabled={page === 0}>Previous</button>
            <span>Page {page + 1}</span>
            <button onClick={handleNext} disabled={!hasMore}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}

