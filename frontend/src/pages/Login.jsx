import { useState } from "react";
import { loginUser } from "../services/authService";
import {
    isValidEmail,
    isValidPassword
} from "../utils/validation.js";
import { useNavigate } from "react-router-dom";

function Login({ setToken }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {

        if (!email || !password) {
            alert("Please fill all fields");
            return;
        }

        if (!isValidEmail(email)) {
            alert("Please enter a valid email");
            return;
        }

        if (!isValidPassword(password)) {
            alert("Password must be at least 8 characters");
            return;
        }

        const data = await loginUser(
            email,
            password
        );

        if (data.token) {
            localStorage.setItem("token", data.token);
            setToken(data.token);
            navigate("/search");
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">

            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Login
                </h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    Login
                </button>

            </div>

        </div>
    );
}

export default Login;