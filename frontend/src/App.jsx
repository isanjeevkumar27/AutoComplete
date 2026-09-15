import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    return (
        <BrowserRouter>
            <Routes>

    {/* Public Home */}
    <Route
        path="/"
        element={<Home />}
    />

    {/* Public Login */}
    <Route
        path="/login"
        element={
            token
                ? <Navigate to="/search" />
                : <Login setToken={setToken} />
        }
    />

    {/* Public Register */}
    <Route
        path="/register"
        element={
            token
                ? <Navigate to="/search" />
                : <Register />
        }
    />

    {/* Protected Search */}
    <Route
        path="/search"
        element={
            <ProtectedRoute>
                <Search setToken={setToken} />
            </ProtectedRoute>
        }
    />

    <Route
        path="*"
        element={<Navigate to="/" />}
    />

</Routes>
        </BrowserRouter>
    );
}

export default App;