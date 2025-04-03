import {useContext, useRef, useState} from "react";
import { useNavigate} from "react-router-dom";
import {AppContext} from "../../Context/AppContext.jsx";
import {TextInput, Space, Button, Anchor, PasswordInput, Notification} from "@mantine/core";
import PropTypes from 'prop-types'
import PasswordValidationPopover from "../../components/PasswordValidationPopover.jsx";


export default function Register({  closeModal, toggleForm }) {
    const { setToken, setUser } = useContext(AppContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ visible: false, message: '', color: '' });
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPasswordValidation, setShowPasswordValidation] = useState(false);
    const passwordInputRef = useRef(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    // ฟังก์ชันตรวจสอบความถูกต้องของข้อมูล
    const validateForm = () => {
        const newErrors = {};
        
        // ตรวจสอบชื่อ
        if (!formData.name.trim()) {
            newErrors.name = ['Please enter your name'];
        }

        // ตรวจสอบอีเมล
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = ['Please enter your email'];
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = ['Invalid email format'];
        }

        // ตรวจสอบรหัสผ่าน (เราจะใช้ PasswordValidationPopover สำหรับ realtime validation)
        // แต่ยังตรวจสอบความถูกต้องอีกครั้งก่อนส่งข้อมูล
        const passwordValid =
            formData.password.length >= 8 &&
            /[A-Z]/.test(formData.password) &&
            /[a-z]/.test(formData.password) &&
            /[0-9]/.test(formData.password) &&
            /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

        if (!passwordValid) {
            newErrors.password = ['Password does not meet all requirements'];
        }

        // ตรวจสอบการยืนยันรหัสผ่าน
        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = ['Passwords do not match'];
        }

        return newErrors;
    };

    async function handleRegister(e) {
        e.preventDefault();
        setIsLoading(true);
        setNotification({ visible: false, message: '', color: '' });
        setErrors({});

        // ตรวจสอบความถูกต้องของข้อมูลก่อนส่งไป server
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setNotification({
                visible: true,
                message: "Please check your information and try again",
                color: "red"
            });
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/register`, {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            
            if (res.status === 422) {
                setErrors(data.errors || {});
                // Check if email is already taken
                if (data.errors?.email?.[0]?.includes('taken') || data.errors?.email?.[0]?.includes('already')) {
                    setNotification({
                        visible: true,
                        message: "This email is already registered",
                        color: "red"
                    });
                } else {
                    setNotification({
                        visible: true,
                        message: "Please check your information and try again",
                        color: "red"
                    });
                }
            } else if (!res.ok) {
                setNotification({
                    visible: true,
                    message: data.message || "An error occurred during registration",
                    color: "red"
                });
            } else {
                setNotification({
                    visible: true,
                    message: "Registration successful. Redirecting to home page...",
                    color: "green"
                });
                setToken(data.token);
                setUser(data.user);
                
                // Delay redirect to show success message
                setTimeout(() => {
                    closeModal();
                    navigate('/');
                }, 2000);
            }
        } catch (error) {
            console.error("Registration error:", error);
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
            <h1 className="">Register a new account</h1>

            {notification.visible && (
                <Notification 
                    title={notification.color === "red" ? "An error occurred." : "Notification"}
                    color={notification.color}
                    onClose={() => setNotification({ visible: false, message: '', color: '' })}
                >
                    {notification.message}
                </Notification>
            )}

            <form onSubmit={handleRegister} className="">
                <div>
                    <TextInput  
                        label="Name" 
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => {
                            setFormData({...formData, name: e.target.value});
                            setErrors({...errors, name: null});
                        }}
                        error={errors.name?.[0]}
                    />
                    <Space h="md"/>
                </div>

                <div>
                    <TextInput 
                        label="Email" 
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
                        ref={passwordInputRef}
                        label="Password" 
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => {
                            setFormData({...formData, password: e.target.value});
                            setErrors({...errors, password: null});
                        }}
                        error={errors.password?.[0]}
                        onFocus={() => setShowPasswordValidation(true)}
                        onBlur={() => setTimeout(() => setShowPasswordValidation(false), 200)}
                    />
                   {showPasswordValidation && formData.password.length > 0 && (
                        <PasswordValidationPopover password={formData.password} />
                    )}
                    <Space h="md"/>
                </div>

                <div>
                    <PasswordInput 
                        label="Confirm Password" 
                        placeholder="Confirm Password"
                        value={formData.password_confirmation}
                        onChange={(e) => {
                            setFormData({...formData, password_confirmation: e.target.value});
                            setErrors({...errors, password_confirmation: null});
                        }}
                        error={errors.password_confirmation?.[0]}
                    />
                    <Space h="md"/>
                </div>

                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Anchor onClick={toggleForm} style={{ cursor: 'pointer' }}>
                        Have and account? Login
                    </Anchor>
                    <Button type="submit" variant="filled" color="green" loading={isLoading}>Register</Button>
                </div>
            </form>
        </>
    );
}

Register.propTypes = {
    closeModal: PropTypes.func,
    toggleForm: PropTypes.func,
};
