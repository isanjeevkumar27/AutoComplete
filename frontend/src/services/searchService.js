const API_URL = import.meta.env.VITE_API_URL;

export const autocomplete = async (query) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/search?q=${encodeURIComponent(query)}`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    return data;
};

export const searchQuery = async (query) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/search`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                query: query
            })
        }
    );

    const data = await response.json();

    return data;
};

export const acceptSuggestion = async (query) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/search/accept`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                query: query
            })
        }
    );

    const data = await response.json();

    return data;
};