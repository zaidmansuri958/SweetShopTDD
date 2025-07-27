import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Login from '../pages/Login/Login.jsx';

// Mock axios and navigation
jest.mock('axios');
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockedAxios = axios;

// Helper to render Login with router
const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

describe('Login Component - Basic Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
    window.localStorage = {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
  });

  // Test 1: Check if login form renders
  test('should render login form', () => {
    renderLogin();
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  // Test 2: Check if user can type in input fields
  test('should allow typing in email and password fields', () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  // Test 3: Check password visibility toggle
  test('should toggle password visibility', () => {
    renderLogin();
    
    const passwordInput = screen.getByLabelText('Password');
    const toggleButton = screen.getByLabelText('Toggle password visibility');
    
    // Initially password should be hidden
    expect(passwordInput.type).toBe('password');
    
    // Click to show password
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
  });

  // Test 4: Check role selection
  test('should allow selecting login role', () => {
    renderLogin();
    
    const roleSelect = screen.getByLabelText('Login As');
    
    // Default should be 'user'
    expect(roleSelect.value).toBe('user');
    
    // Change to admin
    fireEvent.change(roleSelect, { target: { value: 'admin' } });
    expect(roleSelect.value).toBe('admin');
  });

  // Test 5: Test successful login
  test('should login successfully and navigate to dashboard', async () => {
    // Mock successful API response
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        token: 'fake-token',
        user: { role: 'user' }
      }
    });

    renderLogin();
    
    // Fill form
    fireEvent.change(screen.getByLabelText('Email Address'), { 
      target: { value: 'user@test.com' } 
    });
    fireEvent.change(screen.getByLabelText('Password'), { 
      target: { value: 'password123' } 
    });
    
    // Submit form
    fireEvent.click(screen.getByText('Sign In'));
    
    // Check if API was called
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/auth/login',
        {
          email: 'user@test.com',
          password: 'password123',
          role: 'user'
        }
      );
    });
    
    // Check if navigated to dashboard
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  // Test 6: Test admin login
  test('should navigate to admin page for admin login', async () => {
    // Mock successful admin API response
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        token: 'fake-admin-token',
        user: { role: 'admin' }
      }
    });

    renderLogin();
    
    // Fill form and select admin role
    fireEvent.change(screen.getByLabelText('Email Address'), { 
      target: { value: 'admin@test.com' } 
    });
    fireEvent.change(screen.getByLabelText('Password'), { 
      target: { value: 'adminpass' } 
    });
    fireEvent.change(screen.getByLabelText('Login As'), { 
      target: { value: 'admin' } 
    });
    
    // Submit form
    fireEvent.click(screen.getByText('Sign In'));
    
    // Check if navigated to admin page
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });

  // Test 7: Test login error
  test('should show error message on login failure', async () => {
    // Mock failed API response
    mockedAxios.post.mockRejectedValueOnce({
      response: {
        data: { message: 'Invalid email or password' }
      }
    });

    renderLogin();
    
    // Fill form with wrong credentials
    fireEvent.change(screen.getByLabelText('Email Address'), { 
      target: { value: 'wrong@test.com' } 
    });
    fireEvent.change(screen.getByLabelText('Password'), { 
      target: { value: 'wrongpass' } 
    });
    
    // Submit form
    fireEvent.click(screen.getByText('Sign In'));
    
    // Check if error alert was shown
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Invalid email or password');
    });
  });

  // Test 8: Test loading state
  test('should show loading state while logging in', async () => {
    // Mock delayed API response
    mockedAxios.post.mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          data: { token: 'token', user: { role: 'user' } }
        }), 100)
      )
    );

    renderLogin();
    
    // Fill and submit form
    fireEvent.change(screen.getByLabelText('Email Address'), { 
      target: { value: 'user@test.com' } 
    });
    fireEvent.change(screen.getByLabelText('Password'), { 
      target: { value: 'password123' } 
    });
    fireEvent.click(screen.getByText('Sign In'));
    
    // Check loading text appears
    expect(screen.getByText('Signing In...')).toBeInTheDocument();
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Signing In...')).not.toBeInTheDocument();
    });
  });

  // Test 9: Test navigation buttons
  test('should navigate when clicking navigation links', () => {
    renderLogin();
    
    // Test back button
    fireEvent.click(screen.getByText('← Back'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
    
    // Test forgot password link
    fireEvent.click(screen.getByText('Forgot your password?'));
    expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
    
    // Test signup link
    fireEvent.click(screen.getByText('Create one here'));
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });
});