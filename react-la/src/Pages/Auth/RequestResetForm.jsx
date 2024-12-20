import {useState} from "react";
import axios from "axios";
import PropTypes from "prop-types";
import {Button, Notification, Space, TextInput} from "@mantine/core";


function RequestResetForm({closeModal,}) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification]
        = useState({ visible: false, message: '', color: ''});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // ตั้งค่า isLoading เป็น true เมื่อเริ่มทำงาน
        try {
            await axios.post('/api/password/request-reset', {email});
            setNotification({ visible: true, message:'Password reset link sent to your email.', color: 'green'});
            setTimeout(() => {
                closeModal();
            }, 5000);
        } catch (err) {
            console.error(err.response.data);
            setNotification({ visible: true, message: 'We can not find a user with that email address.', color: 'red' });
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