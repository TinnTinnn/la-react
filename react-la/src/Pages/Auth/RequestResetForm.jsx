import {useState} from "react";
import axios from "axios";
import PropTypes from "prop-types";



function RequestResetForm({ closeModal, openResetForm }) {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/password/request-reset', { email });
            alert('Password reset link sent to your email.');
            closeModal();
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <button type="submit">Send Reset Link</button>
        </form>
    );
}

RequestResetForm.propTypes = {
    closeModal: PropTypes.func,
    openResetForm: PropTypes.func,
};

export default RequestResetForm;