import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/search';

/**
 * Fetches autocomplete suggestions from Node → C++ engine.
 * C++ returns: { suggestions: string[] }
 * If suggestions[0] starts with "Did you mean:", it's a spell-check fallback.
 */
export const fetchSuggestions = async ({ query, userId }) => {
  const res = await axios.get(BASE_URL, {
    params: { query, userId },
  });

  const raw = res.data.suggestions || [];

  // Separate spell-check hint from real suggestions
  const didYouMean = raw.find((s) => s.startsWith('Did you mean:')) || null;
  const suggestions = raw.filter((s) => !s.startsWith('Did you mean:'));

  // Extract the suggested word from "Did you mean: <word>?"
  const spellSuggestion = didYouMean
    ? didYouMean.replace('Did you mean: ', '').replace('?', '').trim()
    : null;

  return { suggestions, didYouMean: spellSuggestion };
};


export const saveSelectedQuery = async ({ query, userId }) => {
  await axios.post(`${BASE_URL}/select`, { query, userId });
};


export const fetchRecentSearches = async (userId) => {
  const res = await axios.get(`${BASE_URL}/recent`, { params: { userId } });
  return res.data.recent || [];
};

// GET /api/search/trending
export const fetchTrendingSearches = async () => {
  const res = await axios.get(`${BASE_URL}/trending`);
  return res.data.trending || [];
};
