import React, { useState } from 'react';
import './MakePost.css';

export default function MakePost() {
  const [content, setContent] = useState('');

  const handlePost = async () => {
    if (!content.trim()) return;

    const response = await fetch('https://supabase-socmed.vercel.app/', {
      method: 'POST',
      headers: {
        'app-id': 'your-app-id', 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: content,
        owner: 'user-id', // 
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
