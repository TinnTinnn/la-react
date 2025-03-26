import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AppContext} from "../../Context/AppContext.jsx";
import {TextInput, Space, Button, Anchor, PasswordInput, Notification} from "@mantine/core";
import PropTypes from 'prop-types';


export default function Login({closeModal, toggleForm, openResetModal}) {
    const {setToken} = useContext(AppContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({visible: false, message: '', color: ''});

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    // Validate form fields
    const validateForm = () => {
        const newErrors = {};

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = ['Please enter your email'];
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = ['Invalid email format'];
        }

        // Validate password
        if (!formData.password.trim()) {
            newErrors.password = ['Please enter your password'];
        }

        return newErrors;
    };

    async function handleLogin(e) {
        e.preventDefault();
        setIsLoading(true);
        setNotification({visible: false, message: '', color: ''});
        setErrors({});

        // Validate form before submitting
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setNotification({
                visible: true,
                message: "Please fill in all required fields",
                color: "red"
            });
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/login`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            // ตรวจสอบว่า response มีเนื้อหาหรือไม่
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Response is not JSON");
            }

            // ตรวจสอบว่า response มีเนื้อหาหรือไม่
            const text = await res.text();
            if (!text) {
                throw new Error("Empty response");
            }

            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error("JSON parse error:", e);
                throw new Error("Invalid JSON response");
            }

            if (res.status === 422) {
                setNotification({
                    visible: true,
                    message: "Email not found in our system",
                    color: "red"
                });
            } else if (res.status === 401) {
                setNotification({
                    visible: true,
                    message: "Incorrect password",
                    color: "red"
                });
            } else if (!res.ok) {
                setNotification({
                    visible: true,
                    message: data.message || "An error occurred during login",
                    color: "red"
                });
            } else {
                setNotification({
                    visible: true,
                    message: "Login successful. Redirecting to home page...",
                    color: "green"
                });
                setToken(data.token);
                
                // Delay redirect to show success message
                setTimeout(() => {
                    closeModal();
                    navigate('/');
                }, 2000);
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
                    onClose={() => setNotification({visible: false, message: '', color: ''})}
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
                            setErrors({...errors, email: null});
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
                            setErrors({...errors, password: null});
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