import {createContext, useEffect, useState} from "react";

export const AppContext = createContext();

export default function AppProvider({children}) {
    const [token, setToken] = useState(localStorage.getItem('token'));
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
                // ถ้า token ไม่ถูกต้อง ให้ logout
                logout();
                return;
            }

            const data = await res.json();
            setUser(data);
        } catch (error) {
            console.error('Error fetching user:', error);
            logout();
        }
    }

    useEffect(() => {
        getUser();
    }, [token]);

    // ฟังก์ชันสำหรับ login
    const login = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
    };

    // ฟังก์ชันสำหรับ logout
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AppContext.Provider value={{token, login, logout, user, setUser}}>
            {children}
        </AppContext.Provider>
    );
}