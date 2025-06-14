import React from 'react';
import NavBar from '../components/NavBar';
import PostFeed from '../components/PostFeed';
import './Home.css';

export default function MyLikes() {
  return (
    <div className="home-container">
      <NavBar />
      <div className="feed-wrapper">
        <h2 div className="my-likes-title">My Likes</h2>
        <PostFeed />
      </div>
    </div>
  );
}