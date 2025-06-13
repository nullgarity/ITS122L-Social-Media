import React, { useState } from 'react';
import './MakePost.css';

export default function MakePost() {
  const [content, setContent] = useState('');

  const handlePost = async () => {
    if (!content.trim()) return;

    const response = await fetch('https://dummyapi.io/data/v1/post/create', {
      method: 'POST',
      headers: {
        'app-id': 'your-app-id', // 🔁 Replace with your actual App ID
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: content,
        owner: 'user-id', // 🔁 Replace with actual user ID
        image: '',
      }),
    });

    if (response.ok) {
      setContent('');
      // 🔁 Optionally trigger feed refresh here
    } else {
      alert('Post failed.');
    }
  };

  return (
    <div className="make-post-card">
      <textarea
        className="make-post-input"
        rows={3}
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button className="make-post-button" onClick={handlePost}>
        Post
      </button>
    </div>
  );
}
