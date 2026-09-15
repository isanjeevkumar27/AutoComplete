export const autocomplete = async (query) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `http://localhost:3000/search?q=${query}`,
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
        "http://localhost:3000/search",
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
        "http://localhost:3000/search/accept",
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