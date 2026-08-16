import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchSuggestions, saveSelectedQuery, fetchRecentSearches, fetchTrendingSearches } from '../api/search';

export const useSearch = (userId) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [didYouMean, setDidYouMean] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  


  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [panelLoading, setPanelLoading] = useState(false);

  const debounceRef = useRef(null);
  const didFetchPanel = useRef(false);

  const loadPanel = useCallback(async () => {
    if(didFetchPanel.current) return;
    didFetchPanel.current = true;
    setPanelLoading(true);

    try {
      const [recent, trending] = await Promise.all([
        userId ? fetchRecentSearches(userId) : Promise.resolve([]),
        fetchTrendingSearches(),
      ]);
      console.log(recent);
      console.log(trending);
      setRecentSearches(recent);
      setTrendingSearches(trending);

    } catch(err) {
      console.error('Panel load error:', err);
    } finally {
      setPanelLoading(false);
    }

  }, [userId]);

  const onFocus = () => {
    if(!query) {
      setIsOpen(true);
      loadPanel();
    }
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.length > 1) {
      debounceRef.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const data = await fetchSuggestions({ query, userId });
          setSuggestions(data.suggestions);
          setDidYouMean(data.didYouMean);
          setIsOpen(true);
        } catch (err) {
          console.error('Search error:', err);
          setSuggestions([]);
          setDidYouMean(null);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setDidYouMean(null);
     

      if(query.length === 0 && isOpen) {
        setIsOpen(true);
      }
    }

    return () => clearTimeout(debounceRef.current);
  }, [query, userId]);

  const selectSuggestion = async (text) => {
    setQuery(text);
    setSuggestions([]);
    setDidYouMean(null);
    setIsOpen(false);

    setRecentSearches((prev) => {
      const filtered = prev.filter((r) => r.query != text);
      return [{query: text, count: 1}, ...filtered].slice(0, 8);
    });

    didFetchPanel.current = false;

    try {
      await saveSelectedQuery({ query: text, userId });

    } catch (err) {
      console.error('Failed to save the selected Query:', err);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setDidYouMean(null);
    setIsOpen(false);
    didFetchPanel.current = false;
  };

  const closeDropdown = () => {
    setIsOpen(false);
    didFetchPanel.current = false;
  }

  const showPanel = isOpen && query.length === 0;
  const showSuggestions = isOpen && query.length > 1;

  return {
    query, setQuery,
    suggestions, didYouMean,
    isLoading, isOpen,
    recentSearches, trendingSearches, panelLoading,
    showPanel, showSuggestions,
    selectSuggestion,
    clearSearch,
    closeDropdown, onFocus
  };
};
