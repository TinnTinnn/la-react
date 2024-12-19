import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import axios from "axios";
import {Space, TextInput} from "@mantine/core";


function ResetPasswordForm() {
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [searchParams] = useSearchParams();
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [error, setError] = useState("");

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
            alert('Password reset successfully.');
        } catch (err) {
            console.error(err.response.data);
            setError('Failed to reset password. Please try again.')
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!isTokenValid) {
        return <div>Validating token...</div>
    }

    return (
        <>   <h1 style={{marginTop: '50px'}}>Welcome to the Member Management</h1>
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
                <button type="submit">Reset Password</button>
            </form>
        </>
    )
}

export default ResetPasswordForm;