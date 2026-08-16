import React from 'react';

// Highlights the matching query prefix in a suggestion
const HighlightMatch = ({ text, query }) => {
  if (!query || !text.toLowerCase().startsWith(query.toLowerCase())) {
    return <span className="suggestion-text">{text}</span>;
  }
  return (
    <span className="suggestion-text">
      <strong>{text.slice(0, query.length)}</strong>
      {text.slice(query.length)}
    </span>
  );
};

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const SpellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);

const SuggestionDropdown = ({ suggestions, didYouMean, query, onSelect, onSpellSelect }) => {
  const hasItems = suggestions.length > 0 || didYouMean;
  if (!hasItems) return null;

  return (
    <div className="suggestions-dropdown" role="listbox">
      {/* Spell-check hint */}
      {didYouMean && suggestions.length === 0 && (
        <div
          className="spell-hint"
          role="option"
          onClick={() => onSpellSelect(didYouMean)}
        >
          <span className="suggestion-icon"><SpellIcon /></span>
          <span className="spell-hint-label">Did you mean</span>
          <span className="spell-hint-word">{didYouMean}</span>
        </div>
      )}

      {/* Suggestions list */}
      {suggestions.map((item, index) => (
        <div
          key={index}
          className="suggestion-item"
          role="option"
          onClick={() => onSelect(item)}
        >
          <span className="suggestion-icon"><SearchIcon /></span>
          <HighlightMatch text={item} query={query} />
          <span className="suggestion-arrow"><ArrowIcon /></span>
        </div>
      ))}

      {/* Footer */}
      {suggestions.length > 0 && (
        <div className="suggestions-footer">
          <span className="suggestions-count">
            {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''}
          </span>
          <span className="suggestions-hint">
            <kbd>↵</kbd> to select
          </span>
        </div>
      )}
    </div>
  );
};

export default SuggestionDropdown;
