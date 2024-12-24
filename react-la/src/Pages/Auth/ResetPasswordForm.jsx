import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import axios from "axios";
import {Button, Loader, Modal, Notification, PasswordInput, Space,} from "@mantine/core";
import PropTypes from "prop-types";



function ResetPasswordForm() {
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [searchParams] = useSearchParams();
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [error, setError] = useState("");
    const [opened, setOpened] = useState(true);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const passwordStrengthRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    const [notification, setNotification]
        = useState({ visible: false, message: '', color: ''});

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await axios.post('api/password/verify-token', {token, email});
                if (response.status === 200) {
                    setTimeout(() =>{
                        setIsTokenValid(true); // Token ใช้งานได้
                    }, 3000); // ยืดเวลาการแสดงข้อความ 3 วินาที ไม่งั้น มองไม่่ทัน
                }
            } catch (err) {
                setError(err.response.data, 'Invalid or expired token. Please request a new reset password link.');
            }
        };
        verifyToken();
    }, [token, email]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        // ตรวจสอบ Password หากไม่ตรงกันทั้ง 2 ช่อง จะแจ้ง User ทันที
        if (password !== passwordConfirm) {
            setNotification({
                visible: true,
                message: "Passwords don't match, please try again.",
                color: "red",
            });
            return;
        }

        // ตรวจสอบความแข็งแรงของ password
        if (!passwordStrengthRegex.test(password)) {
            setNotification({
                visible: true,
                message: "Password must be at least 8 characters, include an uppercase letter and a number.",
                color: "red",
            });
            return; // return ที่มีแบบนี้ ในหลายๆจุดที่เขียนไว้ หมายถึง หยุดการทำงาน ไม่เรียก API ต่อจากนั้น
        }

        setIsLoading(true);

        try {
            // ตรงนี้ปรับแต่งให้ส่งคำขอรีเซ็ทรหัสผ่านทันที หากตรงเงื่อนไขทั้งหมด
            const response = await axios.post('/api/password/reset', {
                email,
                token,
                password,
                password_confirmation: passwordConfirm,
            });

           if (response.status === 200) {
               setNotification({
                   visible: true,
                   message: "Password reset successfully. Please login again with new password.",
                   color: "green",
               });

               // หน่วงเวลา 3 วินาที ก่อนจะปิด Modal
               setTimeout(() => {
                   setOpened(false);
                   navigate('/overview') // พาไปหน้า dashboard
               }, 3000);
           }


        } catch (err) {
            console.error(err.response.data);
            setNotification({
                visible: true,
                message: err.response?.data?.error || "Failed to reset password. Please try again",
                color: "red",
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Reset Your Password"
                centered
            >
                {error ? (
                    <div>Invalid or expired token. Please request a new reset password link.</div>
                ) : !isTokenValid ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <span>Validating token...</span> &nbsp;&nbsp;
                        <Loader  size={20}/>
                    </div>

                ) : (
                    <>
                        {notification.visible && (
                            <Notification title="Notification" color={notification.color}>
                                {notification.message}
                            </Notification>
                        )}

                    <form onSubmit={handleSubmit}>
                        <div>
                            <PasswordInput
                                label="Password"
                                type="password"
                                placeholder="New password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Space h="md"/>
                        </div>
                        <div>
                            <PasswordInput
                                label="Confirm Password"
                                type="password"
                                placeholder="Confirm new password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                required
                            />
                            <Space h="md"/>
                        </div>
                        <Button type="submit" loading={isLoading} fullWidth>Reset Password</Button>
                    </form>
                    </>
                )}
            </Modal>
        </>
    )
}

ResetPasswordForm.propTypes = {
    openLoginModal: PropTypes.func,
};
export default ResetPasswordForm;