export const loginUser = async (email, password) => {
    const API_URL = import.meta.env.VITE_API_URL;

    const response = await fetch(
        `${API_URL}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }
    );

    const data = await response.json();

    return data;
};

export const registerUser = async (username, email, password) => {
    const API_URL = import.meta.env.VITE_API_URL;

    const response = await fetch(
        `${API_URL}/auth/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        }
    );

    const data = await response.json();

    return data;
};