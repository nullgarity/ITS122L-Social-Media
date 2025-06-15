import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import PostCard from './PostCard';
import './PostFeed.css';

export default function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        // Fetch posts
        const postRes = await api.get(`/post?page=${page}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedPosts = postRes.data || [];

        // Fetch users
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

        const postsWithUser = fetchedPosts.map(post => {
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
            commentsCount: commentsCount,
          };
        });

        setPosts(postsWithUser);
        setHasMore(fetchedPosts.length === 10);
      } catch (err) {
        console.error('Error fetching posts/users:', err);
      }
    };

    fetchPostsAndUsers();
  }, [page]);

  const handlePrev = () => {
    if (page > 0) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (hasMore) setPage((prev) => prev + 1);
  };

  return (
    <div className="post-feed-container">
      {posts.length === 0 ? (
        <p className="no-posts-message">No posts found.</p>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      )}

      <div className="post-feed-pagination">
        <button onClick={handlePrev} disabled={page === 0}>Previous</button>
        <span>Page {page + 1}</span>
        <button onClick={handleNext} disabled={!hasMore}>Next</button>
      </div>
    </div>
  );
}
