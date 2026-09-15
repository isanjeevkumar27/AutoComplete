export const loginUser = async (email, password) => {

    const response = await fetch(
        "http://localhost:3000/auth/login",
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

    const response = await fetch(
        "http://localhost:3000/auth/register",
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