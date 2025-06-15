// src/components/ReplyFeed.jsx
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import ReplyItem from './ReplyItem';
import './ReplyFeed.css';

export default function ReplyFeed({ replies }) {
  const [userMap, setUserMap] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('authToken');
      const uniqueUserIds = [...new Set(replies.map(r => r.owned_by))];

      try {
        const fetchedUsers = await Promise.all(
          uniqueUserIds.map(async (userId) => {
            const res = await axios.get(`/user/${userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            return { userId, user: res.data };
          })
        );

        const map = {};
        fetchedUsers.forEach(({ userId, user }) => {
          map[userId] = user;
        });

        setUserMap(map);
      } catch (err) {
        console.error('Failed to fetch reply authors:', err);
      }
    };

    if (replies.length > 0) fetchUsers();
  }, [replies]);

  return (
    <div className="reply-feed">
      {replies.map(reply => (
        <ReplyItem key={reply.id} reply={reply} user={userMap[reply.owned_by]} />
      ))}
    </div>
  );
}
