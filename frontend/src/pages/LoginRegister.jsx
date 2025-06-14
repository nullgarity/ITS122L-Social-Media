import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginRegister.css';

export default function LoginRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);


  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const navigate = useNavigate();

  const validateInput = () => {
    if (!email || !password) {
      setMessage('Both email and password are required.');
      return false;
    }

    const emailPattern = /^[^@\s]+@[^@\s]+\.com$/i;
    if (!emailPattern.test(email)) {
      setMessage('Please enter a valid email ending in .com');
      return false;
    }

    return true;
  };

  const handleAuth = async (type) => {
    setIsLoading(true);
    setMessage('');

    if (!validateInput()) {
      setIsLoading(false);
      return;
    }

    const endpoint = type === 'login' ? '/api/sign-in.php' : '/api/register.php';
    const url = `${API_BASE}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (type === 'login') {
          setMessage('Login successful!');

          // Save user data to localStorage
          localStorage.setItem('token', data.token || ''); // optional token support
          localStorage.setItem(
            'user',
            JSON.stringify({
              id: data.id,
              fName: data.fName,
              lName: data.lName,
              email: data.email,
              profile_picture: data.profile_picture,
            })
          );

          navigate('/home');
        } else {
          setMessage('Registration successful! Please log in.');
        }
      } else {
        setMessage(data.message || 'Something went wrong.');
      }
    } catch (error) {
      setMessage(`Network error: ${error.message}`);
    } finally {
      setIsLoading(false);
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

        <button
          className="btn signin-btn"
          onClick={() => handleAuth('login')}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? 'Signing In...' : 'Sign In'}
        </button>

        <button
          className="btn register-btn"
          onClick={() => handleAuth('register')}
          disabled={isRegistering}
        >
          {isRegistering ? 'Registering...' : 'Register'}
        </button>

          <p className="message">{message}</p>
        </div>
      </div>

      <footer>
        <p>&copy; ITS122L Social Media | Mendoza, Fuensalida, Ercia, Panes, Tresvalles</p>
      </footer>
    </div>
  );
}