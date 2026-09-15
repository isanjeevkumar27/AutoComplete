import {
    autocomplete,
    searchQuery,
    acceptSuggestion
} from "../services/searchService";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Search({ setToken }) {

    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    //it is to store the search result when the user clicks the search button
    // value,true/false
    const [searchResult, setSearchResult] = useState(null);

    //it is to store the "Did you mean" suggestion when the user clicks the search button
    const [didYouMean, setDidYouMean] = useState("");

    //it is used to prevent autocomplete API call when query is changed programmatically
    const skipAutocomplete = useRef(false);

    const navigate = useNavigate();

    //it handles logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
        navigate("/");
    };

    //when the query changes, 
    // we want to call the autocomplete function and get suggestions

    useEffect(() => {

        //if query was changed by clicking a suggestion or accepting "Did you mean"
        //then we don't want to call autocomplete API
        if (skipAutocomplete.current) {
            skipAutocomplete.current = false;
            return;
        }

        // "Query is empty, clear suggestions and stop executing this effect."

        // User types "ama"
        //      ↓
        // API call
        //      ↓
        // suggestions appear

        // User deletes everything
        //      ↓
        // query.length === 0
        //      ↓
        // setSuggestions([])
        //      ↓
        // return
        //      ↓
        // NO API CALL

        if (query.length === 0) {
            setSuggestions([]);
            setSearchResult(null);
            setDidYouMean("");
            return;
        }

        const getSuggestions = async () => {
            const data = await autocomplete(query);
            setSuggestions(data.suggestions);
        };

        getSuggestions();

    }, [query]);

    // word=="amazon" remove the suggestions and store in input bar
    const handleSuggestionClick = (word) => {
        skipAutocomplete.current = true;

        setQuery(word);
        setSuggestions([]);
        setSearchResult(null);
        setDidYouMean("");
    };

    //it is handling the "Did you mean" suggestion when the user clicks on it
    const handleAcceptSuggestion = async () => {

        const data = await acceptSuggestion(didYouMean);

        skipAutocomplete.current = true;

        setQuery(didYouMean);

        setSearchResult({
            found: true,
            query: didYouMean
        });

        setDidYouMean("");
        setSuggestions([]);
    };

    //it is handling the "Did you mean" suggestion when the user rejects it
    const handleRejectSuggestion = async () => {

        const data = await acceptSuggestion(query);

        setSearchResult({
            found: true,
            query: query
        });

        setDidYouMean("");
        setSuggestions([]);
    };

    //this is to handle the search query when the user clicks the search button
    const handleSearch = async () => {

        if (!query) {
            return;
        }

        const data = await searchQuery(query);

        setSearchResult(data);
        setSuggestions([]);

        if (data.found) {
            setDidYouMean("");
        } else {
            setDidYouMean(data.didYouMean);
        }

    };

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Top bar */}
            <div className="flex justify-end px-8 py-6">
                <button
                    onClick={handleLogout}
                    className="px-5 py-2 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition"
                >
                    Logout
                </button>
            </div>

            {/* Main search card */}
            <div className="flex justify-center px-4 pt-16">

                <div className="bg-white w-full max-w-3xl p-10 rounded-2xl shadow-lg">

                    <h1 className="text-4xl font-bold text-center text-gray-800 mb-3">
                        Autocomplete Search Engine
                    </h1>

                    <p className="text-center text-gray-500 mb-10">
                        Search faster with intelligent and personalized suggestions.
                    </p>

                    {/* Search bar */}
                    <div className="flex">

                        <input
                            type="text"
                            placeholder="Search anything..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 px-5 py-4 border border-gray-300 rounded-l-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            onClick={handleSearch}
                            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-r-xl hover:bg-blue-700 transition"
                        >
                            Search
                        </button>

                    </div>

                    {/* Suggestions */}
                    {suggestions.length > 0 && (
                        <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden shadow-sm">

                            {suggestions.map((suggestion) => (
                                <p
                                    key={suggestion.word}
                                    onClick={() =>
                                        handleSuggestionClick(suggestion.word)
                                    }
                                    className="px-5 py-3 bg-white text-gray-700 cursor-pointer hover:bg-gray-50 transition"
                                >
                                    {suggestion.word}
                                </p>
                            ))}

                        </div>
                    )}

                    {/* Successful search */}
                    {searchResult && searchResult.found && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                            <p className="text-green-700 font-medium">
                                Search successful: {searchResult.query}
                            </p>
                        </div>
                    )}

                    {/* Did You Mean */}
                    {didYouMean && (
                        <div className="mt-6 p-5 bg-blue-50 border border-blue-200 rounded-xl">

                            <p className="text-gray-700 mb-4">
                                Did you mean{" "}
                                <span className="font-semibold text-blue-600">
                                    "{didYouMean}"
                                </span>
                                ?
                            </p>

                            <div className="flex gap-3">

                                <button
                                    onClick={handleAcceptSuggestion}
                                    className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                                >
                                    Accept
                                </button>

                                <button
                                    onClick={handleRejectSuggestion}
                                    className="px-5 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition"
                                >
                                    Reject
                                </button>

                            </div>

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default Search;