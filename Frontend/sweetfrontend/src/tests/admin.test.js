import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import AdminPanel from './AdminPanel';

jest.mock('axios');
jest.mock('../../components/LogoutButton', () => () => <div>Logout</div>);

const mockSweets = [
  {
    _id: '1',
    name: 'Test Sweet',
    description: 'Test description',
    category: 'cake',
    price: 100,
    rating: 4.5,
    image: '🍰',
    inStock: true,
    tags: ['sweet', 'cake']
  }
];

describe('AdminPanel', () => {
  beforeEach(() => {
    Storage.prototype.getItem = jest.fn(() => 'fake-token');
    axios.get.mockResolvedValue({ data: mockSweets });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders admin panel and fetches sweets', async () => {
    render(<AdminPanel />);
    
    expect(screen.getByText('🍬 Admin Sweet Panel')).toBeInTheDocument();
    expect(screen.getByText('Add Sweet')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Test Sweet')).toBeInTheDocument();
    });
    expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/sweets');
  });

  test('opens add sweet dialog', () => {
    render(<AdminPanel />);
    
    fireEvent.click(screen.getByText('Add Sweet'));
    expect(screen.getByText('Add Sweet')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  test('submits new sweet', async () => {
    axios.post.mockResolvedValue({});
    render(<AdminPanel />);
    
    fireEvent.click(screen.getByText('Add Sweet'));
    
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'New Sweet' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'Add Sweet' }));
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/sweets',
        expect.objectContaining({ name: 'New Sweet' }),
        expect.objectContaining({
          headers: { Authorization: 'Bearer fake-token' }
        })
      );
    });
  });

  test('deletes sweet', async () => {
    axios.delete.mockResolvedValue({});
    render(<AdminPanel />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Sweet')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Delete'));
    
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        'http://localhost:5000/api/sweets/1',
        expect.objectContaining({
          headers: { Authorization: 'Bearer fake-token' }
        })
      );
    });
  });
});