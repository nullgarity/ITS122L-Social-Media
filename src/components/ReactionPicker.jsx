import React from 'react';
import './ReactionPicker.css';
import api from '../api/axios';

const ReactionPicker = ({ postId, onReactionSelect }) => {
  const reactions = [
    { emoji: '👍', name: 'like' },
    { emoji: '❤️', name: 'love' },
    { emoji: '😂', name: 'haha' },
    { emoji: '😮', name: 'wow' },
    { emoji: '😢', name: 'sad' },
    { emoji: '😡', name: 'angry' }
  ];

  const handleReaction = async (reactionType) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('You must be logged in to react.');
        return;
      }

      await api.post(`/post/${postId}/react`, {
        reaction: reactionType
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (onReactionSelect) {
        onReactionSelect(reactionType);
      }
    } catch (error) {
      console.error('Failed to react to post:', error);
      // For now, we'll just log the error since the API might not support reactions yet
    }
  };

  return (
    <div className="reaction-picker">
      {reactions.map((reaction) => (
        <button
          key={reaction.name}
          className="reaction-option"
          onClick={() => handleReaction(reaction.name)}
          title={reaction.name}
        >
          {reaction.emoji}
        </button>
      ))}
    </div>
  );
};

export default ReactionPicker;
