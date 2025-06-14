import React from 'react';
import NavBar from '../components/NavBar';
import MakePost from '../components/MakePost';
import PostFeed from '../components/PostFeed';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <NavBar />
      <div className="feed-wrapper">
        <MakePost />
        <PostFeed />
      </div>
    </div>
  );
}
