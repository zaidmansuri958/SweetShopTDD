import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../pages/Register/Register.jsx';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';

// Mocking
jest.mock('axios');
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  );
};

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all form inputs correctly', () => {
    renderComponent();
    expect(screen.getByPlaceholderText(/enter your full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/create a strong password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm your password/i)).toBeInTheDocument();
  });

  test('shows and hides password on toggle click', () => {
    renderComponent();
    const toggleBtn = screen.getAllByRole('button').find(btn => btn.textContent.includes('👁️‍🗨️'));

    const passwordInput = screen.getByPlaceholderText(/create a strong password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('displays password strength', () => {
    renderComponent();
    const passwordInput = screen.getByPlaceholderText(/create a strong password/i);
    fireEvent.change(passwordInput, { target: { value: 'Test123!' } });

    expect(screen.getByText(/Password strength:/)).toBeInTheDocument();
  });

  test('prevents submission when passwords do not match', async () => {
    renderComponent();
    fireEvent.change(screen.getByPlaceholderText(/enter your full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/create a strong password/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByPlaceholderText(/confirm your password/i), { target: { value: 'Mismatch' } });

    window.alert = jest.fn();
    fireEvent.click(screen.getByText(/create account/i));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Passwords don't match!");
    });
  });

  test('submits form and navigates on successful registration', async () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/enter your full name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/create a strong password/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByPlaceholderText(/confirm your password/i), { target: { value: 'Password123!' } });

    axios.post.mockResolvedValue({
      status: 201,
      data: { token: 'test-token' }
    });

    fireEvent.click(screen.getByText(/create account/i));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Registration successful!');
      expect(localStorage.getItem('token')).toEqual('test-token');
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('shows error message on failed registration', async () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/enter your full name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/create a strong password/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByPlaceholderText(/confirm your password/i), { target: { value: 'Password123!' } });

    axios.post.mockRejectedValue({
      response: { data: { message: 'Email already in use' } }
    });

    window.alert = jest.fn();
    fireEvent.click(screen.getByText(/create account/i));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Email already in use');
    });
  });

  test('navigates to login page', () => {
    renderComponent();
    fireEvent.click(screen.getByText(/sign in here/i));
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/login');
  });

  test('navigates to home on back button click', () => {
    renderComponent();
    fireEvent.click(screen.getByText(/← back/i));
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
  });

  test('navigates to terms and privacy on link click', () => {
    renderComponent();

    fireEvent.click(screen.getByText(/terms of service/i));
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/terms');

    fireEvent.click(screen.getByText(/privacy policy/i));
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/privacy');
  });
});
