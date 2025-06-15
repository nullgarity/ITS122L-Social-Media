import React, { useState } from 'react';
import axios from '../api/axios';
import './MakePost.css';

export default function MakePost({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [posting, setPosting] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFilePreview(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    // Reset file input
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handlePost = async () => {
    if (!content.trim() && !selectedFile) {
      alert('Please write something or select a file to post.');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('You must be logged in to post.');
      return;
    }

    setPosting(true);

    try {
      let postData = { content };

      // If there's a file, we would normally upload it first
      // For now, we'll just include the content
      if (selectedFile) {
        // In a real implementation, you would upload the file to a service
        // and get back a URL to include in the post
        postData.content += `\n\n[File: ${selectedFile.name}]`;
      }

      const response = await axios.post('/post/create', postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setContent('');
      setSelectedFile(null);
      setFilePreview(null);
      
      if (onPostCreated) {
        onPostCreated(response.data);
      }
      
      // Refresh the page to show the new post
      window.location.reload();
    } catch (err) {
      console.error('Post failed:', err);
      alert('Post failed. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="make-post-card">
      <div className="make-post-header">
        <img
          src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop"
          alt="Your profile"
          className="make-post-avatar"
        />
        <textarea
          className="make-post-input"
          rows={3}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={posting}
        />
      </div>

      {filePreview && (
        <div className="file-preview">
          <div className="file-preview-header">
            <span>Preview</span>
            <button className="remove-file-btn" onClick={removeFile}>
              ✕
            </button>
          </div>
          <img src={filePreview} alt="Preview" className="preview-image" />
        </div>
      )}

      {selectedFile && !filePreview && (
        <div className="file-info">
          <div className="file-info-content">
            <span className="file-icon">📎</span>
            <span className="file-name">{selectedFile.name}</span>
            <button className="remove-file-btn" onClick={removeFile}>
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="make-post-actions">
        <div className="post-options">
          <label className="post-option" htmlFor="file-input">
            <span className="option-icon">📷</span>
            <span>Photo/Video</span>
            <input
              id="file-input"
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              hidden
              disabled={posting}
            />
          </label>
          
          <div className="post-option">
            <span className="option-icon">😊</span>
            <span>Feeling/Activity</span>
          </div>
        </div>

        <button 
          className="make-post-button" 
          onClick={handlePost}
          disabled={posting || (!content.trim() && !selectedFile)}
        >
          {posting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
}
