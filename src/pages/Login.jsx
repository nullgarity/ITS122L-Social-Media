// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './LoginRegister.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage('Please enter both email and password.');
      return;
    }

    try {
      const res = await api.post('/sign-in', {
        email,
        password,
      });

      const token = res.data?.access_token;

      if (token) {
        localStorage.setItem('access_token', token);

        // ✅ Get current user info
        const userRes = await api.get('/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = userRes.data;
        localStorage.setItem('current_user', JSON.stringify(user));

        setMessage('Login successful!');
        setTimeout(() => navigate('/home'), 800);
      } else {
        setMessage('Login succeeded but token missing.');
      }
    } catch (err) {
      console.error('Login error:', err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.reasons?.[0] ||
        'Login failed. Please check your credentials.';
      setMessage(msg);
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-logo"><h1>MySocial</h1></div>
        <div className="home-box">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn login-btn" onClick={handleLogin}>
            Login
          </button>

          <p
            className="status-msg"
            onClick={() => navigate('/register')}
            style={{ cursor: 'pointer', marginTop: '8px' }}
          >
            Don't have an account? <u>Register</u>
          </p>

          <p className="status-msg-signin">{message}</p>
        </div>
      </div>
      <footer>
        <p>&copy; ITS122L Social Media | Mendoza, Fuensalida, Ercia, Panes, Tresvalles</p>
      </footer>
    </div>
  );
}