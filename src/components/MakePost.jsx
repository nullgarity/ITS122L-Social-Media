import React, { useState } from 'react';

export default function MakePost() {
  const [content, setContent] = useState('');

  const handlePost = async () => {
    if (!content.trim()) return;

    const response = await fetch('https://dummyapi.io/data/v1/post/create', {
      method: 'POST',
      headers: {
        'app-id': 'your-app-id',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: content, owner: 'user-id', image: '' }),
    });

    if (response.ok) {
      setContent('');
      // Optionally trigger feed refresh here
    } else {
      alert('Post failed.');
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <textarea
        className="w-full border rounded p-2"
        rows={3}
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handlePost} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded w-full">
        Post
      </button>
    </div>
  );
}