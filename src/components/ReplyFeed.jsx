import React, { useState } from 'react';
import ReplyCard from './ReplyCard';

export default function ReplyFeed({ replies, currentUserId, onDelete }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
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
        const enrichedReply = {
          ...reply,
          user: isOwner
            ? {
                fName: currentUser.fName,
                lName: currentUser.lName,
                profilePicture:
                  currentUser.profilePicture && currentUser.profilePicture.trim() !== ''
                    ? currentUser.profilePicture
                    : "https://i.pinimg.com/474x/e6/e4/df/e6e4df26ba752161b9fc6a17321fa286.jpg",
              }
            : reply.user,
        };

        return (
          <ReplyCard
            key={reply.id}
            reply={enrichedReply}
            isOwner={isOwner}
            onDelete={() => {
              setToDeleteId(reply.id);
              setModalOpen(true);
            }}
          />
        );
      })}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div
            style={{
              background: 'var(--secondary-color)',
              borderRadius: '12px',
              padding: '2rem 1.5rem',
              boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
              maxWidth: '350px',
              width: '100%',
              textAlign: 'center',
              color: 'var(--text-color)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div
              style={{
                fontWeight: 'bold',
                fontSize: '1.2rem',
                marginBottom: '1rem',
                color: 'var(--text-color)'
              }}
            >
              Delete reply?
            </div>
            <div
              style={{
                color: 'var(--secondary-text)',
                fontSize: '0.98rem',
                marginBottom: '1.5rem'
              }}
            >
              This can’t be undone and it will be removed from your profile and other user&apos;s feed
            </div>
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center'
              }}
            >
              <button
                style={{
                  background: '#e53935',
                  color: '#fff',
                  border: 'none',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  if (toDeleteId) onDelete(toDeleteId);
                  setModalOpen(false);
                  setToDeleteId(null);
                }}
              >
                Delete
              </button>
              <button
                style={{
                  background: 'var(--button-bg, #f1f1f1)',
                  color: 'var(--text-color)',
                  border: 'none',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
