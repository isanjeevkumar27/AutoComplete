import { useEffect, useState } from "react";
import "./index.css";

function App() {

    const [user, setUser] = useState(
        localStorage.getItem("currentUser")
    );

    const [username, setUsername] = useState("");

    const [query, setQuery] = useState("");

    const [suggestions, setSuggestions] = useState([]);

    const [history, setHistory] = useState([]);

    const login = () => {

        const name = username.trim();

        if (!name) {
            return;
        }

        localStorage.setItem("currentUser", name);

        setUser(name);

        loadHistory(name);
    };


    const logout = () => {

        localStorage.removeItem("currentUser");

        setUser(null);

        setQuery("");

        setSuggestions([]);

        setHistory([]);
    };


    const loadHistory = (name) => {

        const saved =
            JSON.parse(
                localStorage.getItem(`history_${name}`)
            ) || [];

        setHistory(saved);
    };


    const saveSearch = (search) => {

        const key = `history_${user}`;

        let oldHistory =
            JSON.parse(localStorage.getItem(key)) || [];

        oldHistory =
            oldHistory.filter(item => item !== search);

        oldHistory.unshift(search);

        oldHistory = oldHistory.slice(0, 5);

        localStorage.setItem(
            key,
            JSON.stringify(oldHistory)
        );

        setHistory(oldHistory);
    };


    const search = async (value) => {

        setQuery(value);

        if (!value.trim()) {
            setSuggestions([]);
            return;
        }

        try {

            const response =
                await fetch(
                    `/search?q=${encodeURIComponent(value)}`
                );

            const data = await response.json();

            setSuggestions(data.suggestions || []);

        } catch (error) {

            console.error(error);

        }
    };


    const selectSuggestion = (word) => {

        setQuery(word);

        setSuggestions([]);

        saveSearch(word);
    };


    const performSearch = () => {

        if (!query.trim()) {
            return;
        }

        saveSearch(query.trim());

        setSuggestions([]);
    };


    useEffect(() => {

        if (user) {
            loadHistory(user);
        }

    }, [user]);


    if (!user) {

        return (
            <div className="page">

                <div className="login-card">

                    <h1>Search Engine</h1>

                    <p>Login to continue</p>

                    <input
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                login();
                            }
                        }}
                    />

                    <button onClick={login}>
                        Login
                    </button>

                    <small>
                        Demo login — stored locally
                    </small>

                </div>

            </div>
        );
    }


    return (

        <div className="page">

            <div className="app-card">

                <div className="header">

                    <div>
                        <h1>Autocomplete Search</h1>

                        <p>
                            Welcome, <b>{user}</b>
                        </p>
                    </div>

                    <button
                        className="logout"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>


                <div className="search-area">

                    <input
                        type="text"
                        placeholder="Search something..."
                        value={query}
                        onChange={(e) =>
                            search(e.target.value)
                        }
                        onKeyDown={(e) => {

                            if (e.key === "Enter") {
                                performSearch();
                            }

                        }}
                        autoFocus
                    />


                    <button onClick={performSearch}>
                        Search
                    </button>


                    {suggestions.length > 0 && (

                        <div className="suggestions">

                            {suggestions.map((word) => (

                                <div
                                    className="suggestion"
                                    key={word}
                                    onClick={() =>
                                        selectSuggestion(word)
                                    }
                                >
                                    🔍 {word}
                                </div>

                            ))}

                        </div>

                    )}

                </div>


                <div className="history-section">

                    <h3>Recent Searches</h3>

                    {history.length === 0 ? (

                        <p className="empty">
                            No searches yet
                        </p>

                    ) : (

                        <div className="history">

                            {history.map((item) => (

                                <button
                                    className="history-item"
                                    key={item}
                                    onClick={() =>
                                        selectSuggestion(item)
                                    }
                                >
                                    {item}
                                </button>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default App;