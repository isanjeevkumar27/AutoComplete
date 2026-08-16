import React, { useRef, useEffect } from 'react';
import { useSearch } from '../hooks/useSearch';
import SuggestionDropdown from './SuggestionDropdown';
import EmptyPanel from './EmptyPanel';

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ClearIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SearchBar = ({ userId }) => {
  const {
    query, setQuery,
    suggestions, didYouMean,
    isLoading, 
    recentSearches, trendingSearches, panelLoading,
    showPanel, showSuggestions,
    selectSuggestion, clearSearch, closeDropdown, onFocus,
  } = useSearch(userId);

  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeDropdown]);

  // Keyboard: Escape closes dropdown
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeDropdown();
  };

  
  const isDropdownOpen= showPanel || showSuggestions;

  return (
    <div className="searchbar-wrapper" ref={wrapperRef}>
      <div className={`searchbar-container ${isDropdownOpen ? 'open' : ''}`}>
        <span className="searchbar-icon">
          {isLoading ? <div className="spinner" /> : <SearchIcon />}
        </span>

        <input
          className="searchbar-input"
          type="text"
          placeholder="Search anything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus= {onFocus}
          autoComplete="off"
          spellCheck="false"
          aria-label="Search"
          
        />

        {query && (
          <button
            className="searchbar-clear"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <ClearIcon />
          </button>
        )}

        <button className="searchbar-search-btn">Search</button>
      </div>

      {showPanel && (
        <EmptyPanel 
          recentSearches={recentSearches}
          trendingSearches={trendingSearches}
          panelLoading = {panelLoading}
          onSelect = {selectSuggestion}
          />
      )}

      {/* Suggestions dropdown — only when suggestions exist */}
      {showSuggestions && (
        <SuggestionDropdown
          suggestions={suggestions}
          didYouMean={didYouMean}
          query={query}
          onSelect={selectSuggestion}
          onSpellSelect={selectSuggestion}
        />
      )}

      {/* Did you mean — shown below bar when we also have suggestions */}
      {didYouMean && suggestions.length > 0 && (
        <div className="did-you-mean-bar">
          Did you mean{' '}
          <button onClick={() => selectSuggestion(didYouMean)}>
            {didYouMean}
          </button>?
          
        </div>
      )}
    </div>
  );
};

export default SearchBar;
