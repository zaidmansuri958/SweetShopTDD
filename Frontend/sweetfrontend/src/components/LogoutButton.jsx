// src/components/LogoutButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const buttonStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    padding: '8px 16px',
    fontSize: '16px',
    backgroundColor: '#FF4C4C',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
    transition: 'background-color 0.3s ease',
  };

  const hoverStyle = {
    backgroundColor: '#e03e3e',
  };

  return (
    <button
      onClick={handleLogout}
      style={buttonStyle}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
    >
      🚪 Logout
    </button>
  );
};

export default LogoutButton;
