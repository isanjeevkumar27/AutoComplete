import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";

function App() {

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={
                        token
                            ? <Navigate to="/search" />
                            : <Home />
                    }
                />

                <Route
                    path="/login"
                    element={
                        token
                            ? <Navigate to="/search" />
                            : <Login setToken={setToken} />
                    }
                />

                <Route
                    path="/register"
                    element={
                        token
                            ? <Navigate to="/search" />
                            : <Register />
                    }
                />

                <Route
                    path="/search"
                    element={
                        token
                            ? <Search setToken={setToken} />
                            : <Navigate to="/login" />
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