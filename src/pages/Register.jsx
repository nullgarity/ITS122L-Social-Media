import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './LoginRegister.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
  if (!email || !firstName || !lastName || !password || !confirmPassword) {
    setMessage('Please fill out all fields.');
    return;
  }

  if (password !== confirmPassword) {
    setMessage('Passwords do not match.');
    return;
  }

  if (password.length < 8) {
    setMessage('Password must be at least 8 characters long.');
    return;
  }

  try {
    const res = await api.post('/register', {
      email,
      password,
      fName: firstName,
      lName: lastName,
    });

    const token = res.data?.access_token;
    if (token) {
      localStorage.setItem('authToken', token);
      setMessage('Registration successful!');
      setTimeout(() => navigate('/home'), 1000);
    } else {
      setMessage('Unexpected response: no token received.');
    }
    } catch (err) {
      console.error('Registration error:', err);
      const code = err.response?.data?.code;

      if (code === 'user_already_exists') {
        setMessage('An account with this email already exists.');
      } else {
        const serverMsg =
          err.response?.data?.message ||
          err.response?.data?.reasons?.[0] ||
          'Registration failed';
        setMessage(serverMsg);
      }
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-logo"><h1>MySocial</h1></div>
        <div className="home-box">
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

          <button className="btn register-btn" onClick={handleRegister}>
            Register
          </button>

          <p
            className="status-msg"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer', marginTop: '8px' }}
          >
            Already have an account? <u>Sign In</u>
          </p>

          <p className="status-msg-register">{message}</p>
        </div>
      </div>
      <footer>
        <p>&copy; ITS122L Social Media | Mendoza, Fuensalida, Ercia, Panes, Tresvalles</p>
      </footer>
    </div>
  );
}