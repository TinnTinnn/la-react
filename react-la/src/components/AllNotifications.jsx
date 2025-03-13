import {useContext, useEffect, useState} from "react";
import {AppContext} from "../Context/AppContext.jsx";


// ทำหน้านี้ไว้ รอรองรับสำหรับการอยากดูการแจ้งเตือนทั้งหมดที่มี ตอนนี้ยังไม่ได้นำไปใช้

const AllNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const { token } = useContext(AppContext);


    useEffect(() => {
        if (!token) return; // หยุดการทำงานถ้าไม่มี token

        const fetchNotifications = async () => {
            const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
            try {
                const response = await fetch(`${API_URL}/api/notifications/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.status === 401) {
                    throw new Error("Unauthorized");
                }
                const data = await response.json();
                setNotifications(data);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, [token]); // เพิ่ม dependency array

    return (
        <div>
            <h1>All Notification</h1>
            <ul>
                {notifications.map((notif, index) => (
                    <li key={`${notif.message}-${index}`}>{notif.message}</li>
                ))}
            </ul>
        </div>
    )
}

export default AllNotifications;