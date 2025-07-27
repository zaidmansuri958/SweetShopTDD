import React from 'react';

const SearchBar = ({ searchTerm, onSearchChange, onClearSearch }) => (
  <div className="search-bar">
    <input
      type="text"
      placeholder="Search sweets..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
    />
    {searchTerm && <button onClick={onClearSearch}>Clear</button>}
  </div>
);

export default SearchBar;
