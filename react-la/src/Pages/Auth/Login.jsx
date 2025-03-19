import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AppContext} from "../../Context/AppContext.jsx";
import {TextInput, Space, Button, Anchor, PasswordInput, Notification} from "@mantine/core";
import PropTypes from 'prop-types';


export default function Login({closeModal, toggleForm, openResetModal}) {
    const {setToken} = useContext(AppContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ visible: false, message: '', color: '' });

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    async function handleLogin(e) {
        e.preventDefault();
        setIsLoading(true);
        setNotification({ visible: false, message: '', color: '' });
        setErrors({});
        
        try {
            const res = await fetch(`${API_URL}/api/login`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.errors) {
                setErrors(data.errors);
                // จัดการ error messages ตามประเภท
                if (data.errors.email) {
                    setNotification({
                        visible: true,
                        message: "This email is not in the system. Please check again.",
                        color: "red"
                    });
                } else if (data.errors.password) {
                    setNotification({
                        visible: true,
                        message: "Password is incorrect. Please try again.",
                        color: "red"
                    });
                }
            } else if (data.error) {
                // กรณี Laravel ส่ง error message มาโดยตรง
                setNotification({
                    visible: true,
                    message: data.error,
                    color: "red"
                });
            } else {
                setNotification({
                    visible: true,
                    message: "Login successful. You are now redirected to the home page...",
                    color: "green"
                });
                localStorage.setItem("token", data.token);
                setToken(data.token);
                
                // หน่วงเวลาเล็กน้อยเพื่อให้ผู้ใช้เห็น success message
                setTimeout(() => {
                    closeModal();
                    navigate('/');
                }, 1500);
            }
        } catch (error) {
            console.error("Login error:", error);
            setNotification({
                visible: true,
                message: "Connection error occurred. Please try again.",
                color: "red"
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <h1 className="">Login to your account</h1>

            {notification.visible && (
                <Notification 
                    title={notification.color === "red" ? "An error occurred" : "Notification"}
                    color={notification.color}
                    onClose={() => setNotification({ visible: false, message: '', color: '' })}
                >
                    {notification.message}
                </Notification>
            )}

            <form onSubmit={handleLogin} className="">
                <div>
                    <TextInput 
                        label="Email" 
                        type="text" 
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => {
                            setFormData({...formData, email: e.target.value});
                            setErrors({...errors, email: null}); // ล้าง error เมื่อผู้ใช้เริ่มพิมพ์
                        }}
                        error={errors.email?.[0]}
                    />
                    <Space h="md"/>
                </div>

                <div>
                    <PasswordInput 
                        label="Password" 
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => {
                            setFormData({...formData, password: e.target.value});
                            setErrors({...errors, password: null}); // ล้าง error เมื่อผู้ใช้เริ่มพิมพ์
                        }}
                        error={errors.password?.[0]}
                    />
                    <Space h="md"/>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Anchor onClick={toggleForm} style={{cursor: 'pointer'}}>
                        Do not have an account? Register
                    </Anchor>
                    <Anchor onClick={openResetModal} style={{cursor: 'pointer'}}>
                        Forget password?
                    </Anchor>
                </div>
                <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '12px'}}>
                    <Button type="submit" loading={isLoading}>Login</Button>
                </div>
            </form>
        </>
    );
}

Login.propTypes = {
    closeModal: PropTypes.func,
    toggleForm: PropTypes.func,
    openResetModal: PropTypes.func,
};