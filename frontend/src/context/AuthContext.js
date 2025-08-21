import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const SESSION_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Load session from localStorage
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
         console.log("Stored User", storedUser);  // Log the stored user object
        const loginTime = localStorage.getItem('loginTime');

        if (storedUser && loginTime) {
            const now = new Date().getTime();
            if (now - loginTime < SESSION_DURATION) {
                setUser(storedUser);
            } else {
                logout();
            }
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('loginTime', Date.now().toString());
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('loginTime');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
