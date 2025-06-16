import React from 'react';
import ReplyCard from './ReplyCard';

export default function ReplyFeed({ replies, currentUserId, onDelete }) {
  const currentUser = JSON.parse(localStorage.getItem('current_user'));

  if (replies.length === 0) {
    return (
      <div style={{ padding: '1rem', fontStyle: 'italic', color: '#777' }}>
        No replies yet.
      </div>
    );
  }

  return (
    <div className="reply-feed">
      {replies.map(reply => {
        const isOwner = String(reply.owned_by) === String(currentUserId);

        // Inject current user info if missing on owned replies
      const enrichedReply = {
        ...reply,
        user: isOwner
          ? {
              fName: currentUser.fName,
              lName: currentUser.lName,
              profilePicture: currentUser.profilePicture,
            }
          : reply.user,
      };

        return (
          <ReplyCard
            key={reply.id}
            reply={enrichedReply}
            isOwner={isOwner}
            onDelete={() => onDelete(reply.id)}
          />
        );
      })}
    </div>
  );
}
