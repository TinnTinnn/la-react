import {createContext, useEffect, useState} from "react";

export const AppContext = createContext({
    token: null,
    setToken: () => {},
    user: null,
    setUser: () => {}
});

export default function AppProvider({children}) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    async function getUser() {
        const res = await fetch(`${API_URL}/api/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        if (res.ok) {
            setUser(data);
        }
    }

    useEffect(() => {
        if (token) {
            getUser();
        }
    }, [token]);

    const value = {
        token,
        setToken,
        user,
        setUser
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}