// src/__tests__/Register/Render.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../../pages/Register';

// Helper to wrap with Router
const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Register Page - Render Inputs', () => {
  test('renders name, email, password, confirm password fields', () => {
    renderWithRouter(<Register />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument(); // Only the main password field
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });
});
