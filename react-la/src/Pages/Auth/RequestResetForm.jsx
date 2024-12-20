import {useState} from "react";
import axios from "axios";
import PropTypes from "prop-types";
import {Button, Notification, Space, TextInput} from "@mantine/core";


function RequestResetForm({closeModal,}) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification]
        = useState({ visible: false, message: '', color: ''});
    const [isRequestSent, setIsRequestSent] = useState(false); // สถานะสำหรับการส่งคำขอ

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ตรวจสอบตรงจุดนี้ว่ามีการส่งคำขอไปแล้วหรือไม่
        if (isRequestSent) {
            setNotification({
                visible: true,
                message: 'Please check your inbox. You have already requested a reset link.',
                color: 'orange'
            });
            return;
        }

        setIsLoading(true);
        setIsRequestSent(true);

        setIsLoading(true); // ตั้งค่า isLoading เป็น true เมื่อเริ่มทำงาน
        try {
            await axios.post('/api/password/request-reset', {email});
            setNotification({
                visible: true,
                message:'Password reset link sent to your email.',
                color: 'green'
            });

            setIsRequestSent(true); //ตั้งค่าสถานะว่าได้ส่งคำขอไปแล้ว

            setTimeout(() => {
                closeModal();
            }, 5000);
        } catch (err) {
            console.error(err.response.data);

            if (err.response.status === 404) {
                setNotification({ visible: true, message: 'No user found with that email address.', color: 'red' });
            } else if (err.response.status === 429) {
                setNotification({ visible: true, message: 'You are submitting requests too frequently.', color: 'red' });
            } else if (err.response.status === 422) {
                setNotification({ visible: true, message: 'The email field must be a valid email address.', color: 'red' });
            } else {
                setNotification({ visible: true, message: 'There was an error sending the request.', color: 'red' });
            }

            setIsRequestSent(false); // รีเซ็ทสถานะเพื่อให้สามารถส่งคำขอใหม่ได้

        } finally {
            setIsLoading(false); // ตั้งค่า isLoading เป็น false เมื่อเสร็จการเรียก API
            setTimeout(() => {
                setNotification({ visible: false, message: '', color: '' });
            }, 5000);
        }
    };

    return (
        <>
            {notification.visible && (
                <Notification title="Notification" color={notification.color}>
                    {notification.message}
                </Notification>
            )}
            <h1 className="">Request a password reset email</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <TextInput
                        label="Email"
                        type="text"
                        placeholder="Your email here"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Space h="md"/>
                </div>

                <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '12px'}}>
                    <Button type="submit" loading={isLoading}> {/* ใช้ prop `loading` เพื่อแสดง Loader */}
                        {isLoading ? "Submitting..." : "Submit"} {/* เปลี่ยนข้อความของปุ่ม */}
                    </Button>
                </div>
            </form>
        </>
    )
        ;
}

RequestResetForm.propTypes = {
    closeModal: PropTypes.func,
    openResetForm: PropTypes.func,
};

export default RequestResetForm;