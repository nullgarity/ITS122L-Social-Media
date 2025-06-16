import React from 'react';
import defaultProfilePic from '../assets/default-profile.png';
import './ReplyCard.css';

export default function ReplyCard({ reply, isOwner, onDelete }) {
  const formatDate = (iso) => new Date(iso).toLocaleString();

  const rawUser = reply.user || {};
  const user = {
    fName: rawUser.fName || 'Unknown',
    lName: rawUser.lName || 'User',
    profilePicture:
      rawUser.profilePicture && rawUser.profilePicture.trim() !== ''
      ? rawUser.profilePicture
      : defaultProfilePic,
  };

  // 🧪 Debug logs
  console.log('Rendering ReplyCard...');
  console.log('Reply ID:', reply.id);
  console.log('Reply Owned By:', reply.owned_by);
  console.log('User:', user);
  console.log('Current isOwner:', isOwner);

  return (
    <div className="reply-card">
      <img
        src={user.profilePicture}
        alt="Profile"
        className="reply-avatar"
      />
      <div className="reply-main">
        <div className="reply-header">
          <div>
            <strong>{user.fName} {user.lName}</strong>
            <div className="reply-date">{formatDate(reply.created_at)}</div>
          </div>
          {isOwner && (
            <button onClick={onDelete} className="delete-reply-btn">
              Delete
            </button>
          )}
        </div>
        <div className="reply-body">{reply.content}</div>
      </div>
    </div>
  );
}