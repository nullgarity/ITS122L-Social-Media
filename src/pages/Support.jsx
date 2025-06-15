import React from 'react';
import { Link } from 'react-router-dom';
import './Support.css';

export default function Support() {
  return (
    <div className="support-container">
      <div className="support-card">
        <h1>Need Help?</h1>
        
        <section className="support-section">
          <h2>Common Registration Issues</h2>
          <ul>
            <li>Make sure your email address is valid and not already registered</li>
            <li>Password must be at least 8 characters long</li>
            <li>Ensure both password fields match exactly</li>
            <li>Check your internet connection</li>
            <li>Try clearing your browser cache and cookies</li>
          </ul>
        </section>

        <section className="support-section">
          <h2>Contact Support</h2>
          <p>
            If you're still experiencing issues, our support team is here to help:
          </p>
          <div className="contact-options">
            <div className="contact-option">
              <h3>Email Support</h3>
              <a href="mailto:support@mysocial.com">support@mysocial.com</a>
              <p>Response time: Within 24 hours</p>
            </div>
          </div>
        </section>

        <div className="support-actions">
          <Link to="/register" className="back-button">
            ← Back to Registration
          </Link>
        </div>
      </div>
    </div>
  );
}
