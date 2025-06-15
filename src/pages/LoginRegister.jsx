import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './LoginRegister.css';

export default function LoginRegister() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [message, setMessage] = useState('');

  const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'mymail.mapua.edu.ph'];

  const isValidEmail = (email) => {
    const parts = email.split('@');
    return parts.length === 2 && allowedDomains.includes(parts[1]);
  };

  const handleLogin = async () => {
    if (!isValidEmail(email)) {
      setMessage('Please use a valid email.');
      return;
    }

    try {
      const res = await api.post('/login', { email, password });
      const token = res.data.access_token;

      if (token) {
        localStorage.setItem('authToken', token);
        navigate('/home');
      } else {
        setMessage('Login successful but no token received.');
        console.log('Unexpected login response:', res.data);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  const handleRegister = async () => {
    if (!isValidEmail(email)) {
      setMessage('Please use a valid email.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const res = await api.post('/register', {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        profile_picture: profilePicture,
      });
      localStorage.setItem('authToken', res.data.token);
      navigate('/home');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-logo">
          <h1>MySocial</h1>
        </div>
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Profile Picture URL (optional)"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
          />

          <button className="btn signin-btn" onClick={handleLogin}>
            Sign In
          </button>
          <button className="btn register-btn" onClick={handleRegister}>
            Register
          </button>

          <p className="status-msg">{message}</p>
        </div>
      </div>
      <footer>
        <p>&copy; ITS122L Social Media | Mendoza, Fuensalida, Ercia, Panes, Tresvalles</p>
      </footer>
    </div>
  );
}