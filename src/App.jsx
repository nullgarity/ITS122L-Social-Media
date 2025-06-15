import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <NavBar />

      <main className="main-content">
        <h1>MySocial | Like, Post, and Reply to the World</h1>
        <div className="card">
          <button onClick={() => alert("Clicked!")}>
            Test Button
          </button>
        </div>
      </main>
    </>
  );
}

export default App;
