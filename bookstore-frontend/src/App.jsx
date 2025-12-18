import "./App.css";
import axios from "axios";
import LoginScreen from "./LoginScreen";
import { useState, useEffect } from 'react';
import { Route, Routes, BrowserRouter, useNavigate } from "react-router-dom";
import BookScreen from './BookScreen';

axios.defaults.baseURL = import.meta.env.VITE_APP_URL;
const LOCAL_STORAGE_KEY = 'auth_token';
const SESSION_STORAGE_KEY = 'authToken';

const MainApp = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let token = localStorage.getItem(LOCAL_STORAGE_KEY);

        if (!token) {
            token = sessionStorage.getItem(SESSION_STORAGE_KEY);
        }
        if (token) {
            setIsAuthenticated(true);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            if (window.location.pathname === '/') {
                navigate('/books');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLoginSuccess = (token, remember) => {
        alert("Login Success!!!");
        if (remember) {
            localStorage.setItem(LOCAL_STORAGE_KEY, token);
            sessionStorage.removeItem(SESSION_STORAGE_KEY);
        } else {
            sessionStorage.setItem(SESSION_STORAGE_KEY, token);
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setIsAuthenticated(true);
        navigate('/books');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    isAuthenticated ? <BookScreen onLogout={handleLogout} /> : <LoginScreen onLoginSuccess={handleLoginSuccess} />
                }
            />

            <Route
                path="/books"
                element={
                    isAuthenticated ? <BookScreen onLogout={handleLogout} /> : <LoginScreen onLoginSuccess={handleLoginSuccess} />
                }
            />

            <Route path="*" element={<h1>404: Page Not Found</h1>} />
        </Routes>
    );
};


function App() {
    return (
        <BrowserRouter basename="/">
            <MainApp />
        </BrowserRouter>
    );
}
export default App;