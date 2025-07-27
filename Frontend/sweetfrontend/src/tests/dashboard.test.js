import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import SweetProductsPage from '../pages/Dashboard/Dashboard.jsx';

// Mock axios and navigation
jest.mock('axios');
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock LogoutButton component
jest.mock('../components/LogoutButton', () => {
  return function MockLogoutButton() {
    return <button>Logout</button>;
  };
});

const mockedAxios = axios;

// Sample test data
const mockProducts = [
  {
    _id: '1',
    name: 'Chocolate Cake',
    description: 'Rich chocolate cake',
    price: 12.99,
    rating: 4.5,
    category: 'cake',
    inStock: true,
    image: '🍰',
    tags: ['sweet', 'chocolate']
  },
  {
    _id: '2',
    name: 'Gummy Bears',
    description: 'Colorful gummy bears',
    price: 5.99,
    rating: 4.0,
    category: 'gummy',
    inStock: false,
    image: '🐻',
    tags: ['gummy', 'fruity']
  },
  {
    _id: '3',
    name: 'Dark Chocolate',  
    description: 'Premium dark chocolate',
    price: 8.99,
    rating: 4.8,
    category: 'chocolate',
    inStock: true,
    image: '🍫',
    tags: ['dark', 'premium']
  }
];

// Helper to render component with router
const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <SweetProductsPage />
    </BrowserRouter>
  );
};

describe('Sweet Products Dashboard - Basic Tests', () => {
  // Mock localStorage properly
  const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
    
    // Setup localStorage mock to return 'fake-token'
    mockLocalStorage.getItem.mockReturnValue('fake-token');
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
  });

  // Test 1: Check if dashboard loads and shows loading state
  test('should show loading message initially', () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    renderDashboard();
    
    expect(screen.getByText('Loading sweets...')).toBeInTheDocument();
  });

  // Test 2: Check if products are displayed after loading
  test('should display products after loading', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockProducts });
    
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
      expect(screen.getByText('Gummy Bears')).toBeInTheDocument();
      expect(screen.getByText('Dark Chocolate')).toBeInTheDocument();
    });
  });

  // Test 3: Check if search functionality works
  test('should filter products when searching', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockProducts });
    
    renderDashboard();
    
    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
    });
    
    // Search for "chocolate"
    const searchInput = screen.getByPlaceholderText('Search for delicious sweets...');
    fireEvent.change(searchInput, { target: { value: 'chocolate' } });
    
    // Should show chocolate products only
    expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
    expect(screen.getByText('Dark Chocolate')).toBeInTheDocument();
    expect(screen.queryByText('Gummy Bears')).not.toBeInTheDocument();
  });

  // Test 4: Check if clear search button works
  test('should clear search when clear button is clicked', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockProducts });
    
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
    });
    
    // Search for something
    const searchInput = screen.getByPlaceholderText('Search for delicious sweets...');
    fireEvent.change(searchInput, { target: { value: 'chocolate' } });
    
    // Clear search
    const clearButton = screen.getByText('✕');
    fireEvent.click(clearButton);
    
    // Should show all products again
    expect(searchInput.value).toBe('');
    expect(screen.getByText('Gummy Bears')).toBeInTheDocument();
  });

  // Test 5: Check if category filter works
  test('should filter by category', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockProducts });
    
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
    });
    
    // Click on "Cake" category filter
    const cakeCheckbox = screen.getByRole('checkbox', { name: /cake/i });
    fireEvent.click(cakeCheckbox);
    
    // Should show only cake products
    expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
    expect(screen.queryByText('Gummy Bears')).not.toBeInTheDocument();
    expect(screen.queryByText('Dark Chocolate')).not.toBeInTheDocument();
  });

  // Test 6: Check if "In Stock Only" filter works
  test('should filter by stock availability', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockProducts });
    
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('Gummy Bears')).toBeInTheDocument();
    });
    
    // Click "In Stock Only" filter
    const inStockCheckbox = screen.getByRole('checkbox', { name: /in stock only/i });
    fireEvent.click(inStockCheckbox);
    
    // Should hide out-of-stock products
    expect(screen.queryByText('Gummy Bears')).not.toBeInTheDocument();
    expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
    expect(screen.getByText('Dark Chocolate')).toBeInTheDocument();
  });

  // Test 7: Check if sorting works
  test('should sort products by price', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockProducts });
    
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
    });
    
    // Change sort to "Price (Low to High)"
    const sortSelect = screen.getByDisplayValue('Name (A-Z)');
    fireEvent.change(sortSelect, { target: { value: 'price-low' } });
    
    // Get all product names (they should be h3 elements with class "product-name")
    const productNames = screen.getAllByText(/Chocolate Cake|Gummy Bears|Dark Chocolate/);
    
    // First product should be cheapest (Gummy Bears - $5.99)
    expect(productNames[0]).toHaveTextContent('Gummy Bears');
  });

  // Test 8: Check if purchase button works for in-stock items
  test('should handle purchase for in-stock items', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockProducts });
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });
    
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
    });
    
    // Find and click any purchase button that's not disabled
    const purchaseButtons = screen.getAllByText('💸 Purchase');
    fireEvent.click(purchaseButtons[0]);
    
    // Should make API call
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token');
    });
    
    // Should show success alert
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining('Purchase successful!')
    );
  });

  // Test 9: Check if out-of-stock items show correctly  
  test('should show out-of-stock items differently', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockProducts });
    
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('Gummy Bears')).toBeInTheDocument();
    });
    
    // Should show "Out of Stock" text (there are multiple, so use getAllByText)
    const outOfStockTexts = screen.getAllByText('Out of Stock');
    expect(outOfStockTexts.length).toBeGreaterThan(0);
    
    // Check that out-of-stock button is disabled
    const outOfStockButton = screen.getByRole('button', { name: 'Out of Stock' });
    expect(outOfStockButton).toBeDisabled();
  });

  // Test 10: Check if clear filters works
  test('should clear all filters when clear all is clicked', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockProducts });
    
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
    });
    
    // Apply some filters first
    const cakeCheckbox = screen.getByRole('checkbox', { name: /cake/i });
    fireEvent.click(cakeCheckbox);
    
    // Clear all filters
    const clearAllButton = screen.getByText('Clear All');
    fireEvent.click(clearAllButton);
    
    // Should show all products again
    expect(screen.getByText('Gummy Bears')).toBeInTheDocument();
    expect(cakeCheckbox.checked).toBe(false);
  });

  // Test 11: Check error handling
  test('should show error message when API fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));
    
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('Error: Network Error')).toBeInTheDocument();
    });
  });

  // Test 12: Check no products found message
  test('should show no products message when no results', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockProducts });
    
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
    });
    
    // Search for something that doesn't exist
    const searchInput = screen.getByPlaceholderText('Search for delicious sweets...');
    fireEvent.change(searchInput, { target: { value: 'pizza' } });
    
    // Should show no products message
    expect(screen.getByText('No sweets found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search or filters to find delicious treats!')).toBeInTheDocument();
  });
});