import {useState} from "react";
import {useSearchParams} from "react-router-dom";
import axios from "axios";


function ResetPasswordForm() {
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [searchParams] = useSearchParams();

    const token = searchParams.get('token');
    const email = searchParams.get('email');

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
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Confrim new password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
            />
            <button type="submit">Reset Password</button>
        </form>
    )
}

export default ResetPasswordForm;