import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginAs, setLoginAs] = useState('user');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        role: loginAs,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);

      setIsLoading(false);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        alert(error.response.data.message || 'Login failed. Check credentials.');
      } else {
        alert('Server error. Please try again later.');
      }
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="login-container">
      <button className="back-button" onClick={handleBackToHome}>
        ← Back
      </button>

      <div className="login-card">
        <div className="logo-section">
          <div className="logo">🍭</div>
          <h1 className="welcome-title">Welcome Back</h1>
          <p className="welcome-subtitle">Sign in to your sweet account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="password-input-container">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                aria-label="Toggle password visibility"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="loginAs" className="form-label">Login As</label>
            <select
              id="loginAs"
              className="form-input"
              value={loginAs}
              onChange={(e) => setLoginAs(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading && <div className="loading-spinner"></div>}
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="forgot-password">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }}>
            Forgot your password?
          </a>
        </div>

        <div className="divider">or</div>

        <div className="signup-link">
          Don't have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>
            Create one here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
