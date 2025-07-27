import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import '../Dashboard/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../../components/LogoutButton';


// Search Bar Component
const SearchBar = ({ searchTerm, onSearchChange, onClearSearch }) => {
  return (
     
    <div className="search-container">
      <LogoutButton />
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search for delicious sweets..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button className="clear-search" onClick={onClearSearch}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

// Filter Panel Component
const FilterPanel = ({ filters, onFilterChange, onClearFilters }) => {
  const categories = ['chocolate', 'gummy', 'cake', 'candy'];
  const priceRanges = [
    { label: 'Under $10', min: 0, max: 10 },
    { label: '$10 - $15', min: 10, max: 15 },
    { label: '$15 - $20', min: 15, max: 20 },
    { label: 'Over $20', min: 20, max: 1000 }
  ];

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filters</h3>
        <button className="clear-filters" onClick={onClearFilters}>Clear All</button>
      </div>

      <div className="filter-section">
        <h4>Category</h4>
        <div className="filter-options">
          {categories.map(category => (
            <label key={category} className="filter-option">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={(e) => {
                  const newCategories = e.target.checked
                    ? [...filters.categories, category]
                    : filters.categories.filter(c => c !== category);
                  onFilterChange({ ...filters, categories: newCategories });
                }}
              />
              <span className="checkmark"></span>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Price Range</h4>
        <div className="filter-options">
          {priceRanges.map((range, index) => (
            <label key={index} className="filter-option">
              <input
                type="radio"
                name="priceRange"
                checked={filters.priceRange.min === range.min && filters.priceRange.max === range.max}
                onChange={() => onFilterChange({ ...filters, priceRange: range })}
              />
              <span className="radiomark"></span>
              {range.label}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Availability</h4>
        <label className="filter-option">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onFilterChange({ ...filters, inStockOnly: e.target.checked })}
          />
          <span className="checkmark"></span>
          In Stock Only
        </label>
      </div>

      <div className="filter-section">
        <h4>Rating</h4>
        <div className="rating-filter">
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={filters.minRating}
            onChange={(e) => onFilterChange({ ...filters, minRating: parseFloat(e.target.value) })}
            className="rating-slider"
          />
          <span className="rating-value">{filters.minRating}+ ⭐</span>
        </div>
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, onPurchase }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`product-card ${!product.inStock ? 'out-of-stock' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-image">
        <span className="product-emoji">{product.image}</span>
        {!product.inStock && <div className="out-of-stock-overlay">Out of Stock</div>}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>

        <div className="product-rating">
          <span className="stars">{'⭐'.repeat(Math.floor(product.rating))}</span>
          <span className="rating-text">({product.rating})</span>
        </div>

        <div className="product-tags">
          {product.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>

        <div className="product-footer">
          <span className="product-price">${product.price}</span>
          <button
            className={`add-to-cart-btn ${!product.inStock ? 'disabled' : ''}`}
            onClick={() => product.inStock && onPurchase(product)}
            disabled={!product.inStock}
          >
            {product.inStock ? '💸 Purchase' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Products Grid Component
const ProductsGrid = ({ products, onPurchase }) => {
  if (products.length === 0) {
    return (
      <div className="no-products">
        <span className="no-products-icon">🍭</span>
        <h3>No sweets found</h3>
        <p>Try adjusting your search or filters to find delicious treats!</p>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map(product => (
        <ProductCard key={product._id || product.id} product={product} onPurchase={onPurchase} />
      ))}
    </div>
  );
};

// Sort Options Component
const SortOptions = ({ sortBy, onSortChange }) => {
  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'price-low', label: 'Price (Low to High)' },
    { value: 'price-high', label: 'Price (High to Low)' },
    { value: 'rating', label: 'Rating (High to Low)' }
  ];

  return (
    <div className="sort-container">
      <label className="sort-label">Sort by:</label>
      <select
        className="sort-select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

// Main Component
const SweetProductsPage = () => {
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { min: 0, max: 1000 },
    inStockOnly: false,
    minRating: 0
  });
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sweets');
        setProductsData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handlePurchase = async (product) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/inventory/${product._id}/purchase`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(`🎉 Purchase successful! You bought ${product.name}`);
    } catch (err) {
      alert(`❌ Purchase failed: ${err.response?.data?.message || err.message}`);
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = productsData.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        filters.categories.length === 0 || filters.categories.includes(product.category);

      const matchesPrice =
        product.price >= filters.priceRange.min && product.price <= filters.priceRange.max;

      const matchesStock = !filters.inStockOnly || product.inStock;

      const matchesRating = product.rating >= filters.minRating;

      return matchesSearch && matchesCategory && matchesPrice && matchesStock && matchesRating;
    });

    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return filtered;
  }, [productsData, searchTerm, filters, sortBy]);

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: { min: 0, max: 1000 },
      inStockOnly: false,
      minRating: 0
    });
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (loading) return <div className="loading">Loading sweets...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="products-page">
      <div className="page-header">
        <h1 className="page-title">🍭 Sweet Collection</h1>
        <p className="page-subtitle">Discover our premium selection of handcrafted sweets and confections</p>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClearSearch={clearSearch}
      />

      <div className="main-content">
        <FilterPanel
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={clearFilters}
        />

        <div className="products-content">
          <div className="products-header">
            <div className="products-count">
              {filteredProducts.length} sweet{filteredProducts.length !== 1 ? 's' : ''} found
            </div>
            <SortOptions
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>

          <ProductsGrid
            products={filteredProducts}
            onPurchase={handlePurchase}
          />
        </div>
      </div>
    </div>
  );
};

export default SweetProductsPage;
