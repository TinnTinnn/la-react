import {useState} from "react";
import axios from "axios";
import PropTypes from "prop-types";
import {Button, Space, TextInput} from "@mantine/core";


function RequestResetForm({closeModal,}) {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/password/request-reset', {email});
            alert('Password reset link sent to your email.');
            closeModal();
        } catch (err) {
            console.error(err.response.data);
            alert('We can not find a user with that email address.');
        }
    };

    return (
        <>
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
                    <Button type="submit">Submit</Button>
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