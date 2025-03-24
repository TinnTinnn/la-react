import {createContext, useEffect, useState} from "react";

export const AppContext = createContext();

export default function AppProvider({children}) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    // ฟังก์ชันสำหรับตรวจสอบ token และดึงข้อมูล user
    async function getUser() {
        if (!token) {
            setUser(null);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                setToken(null);
                setUser(null);
                return;
            }

            const data = await res.json();
            setUser(data);
        } catch (error) {
            console.error('Error fetching user:', error);
            setToken(null);
            setUser(null);
        }
    }

    useEffect(() => {
        getUser();
    }, [token]);

    // ฟังก์ชันสำหรับ login
    const login = (newToken) => {
        setToken(newToken);
    };

    // ฟังก์ชันสำหรับ logout
    const logout = () => {
        setToken(null);
        setUser(null);
    };

    return (
        <AppContext.Provider value={{token, login, logout, user, setUser}}>
            {children}
        </AppContext.Provider>
    );
}