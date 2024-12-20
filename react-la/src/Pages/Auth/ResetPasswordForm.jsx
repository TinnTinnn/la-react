import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import axios from "axios";
import {Button, Modal, Space, TextInput} from "@mantine/core";
import PropTypes from "prop-types";


function ResetPasswordForm() {
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [searchParams] = useSearchParams();
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [error, setError] = useState("");
    const [opened, setOpened] = useState(true);
    const navigate = useNavigate();


    const token = searchParams.get('token');
    const email = searchParams.get('email');

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await axios.post('api/password/verify-token', {token, email});
                if (response.status === 200) {
                    setIsTokenValid(true); // Token ใช้งานได้
                }
            } catch (err) {
                setError(err.response.data, 'Invalid or expired token. Please request a new reset password link.');
            }
        };
        verifyToken();
    }, [token, email]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/password/reset', {
                email,
                token,
                password,
                password_confirmation: passwordConfirm,
            });

            alert('Password reset successfully. Please login with your new password.');
            setOpened(false);
            navigate('/overview')


        } catch (err) {
            console.error(err.response.data);
            setError('Failed to reset password. Please try again.');
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
                    <div>{error}</div>
                ) : !isTokenValid ? (
                    <div>Validating token...</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div>
                            <TextInput
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
                            <TextInput
                                label="Confirm Password"
                                type="password"
                                placeholder="Confrim new password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                required
                            />
                            <Space h="md"/>
                        </div>
                        <Button type="submit" fullWidth>Reset Password</Button>
                    </form>
                )}
            </Modal>
        </>
    )
}

ResetPasswordForm.propTypes = {
    openLoginModal: PropTypes.func,
};
export default ResetPasswordForm;