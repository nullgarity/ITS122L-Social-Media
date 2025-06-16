import React from 'react';
import ReplyCard from './ReplyCard';

export default function ReplyFeed({ replies, currentUserId, onDelete }) {
  if (replies.length === 0) {
    return (
      <div style={{ padding: '1rem', fontStyle: 'italic', color: '#777' }}>
        No replies yet.
      </div>
    );
  }

  return (
    <div className="reply-feed">
      {replies.map(reply => (
        <ReplyCard
          key={reply.id}
          reply={reply}
          isOwner={String(reply.owned_by) === String(currentUserId)}
          onDelete={() => onDelete(reply.id)}
        />
      ))}
    </div>
  );
}
