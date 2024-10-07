import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AppContext} from "../../Context/AppContext.jsx";
import {TextInput, Space, Button, } from "@mantine/core";

export default function Register() {
    const { setToken } = useContext(AppContext)
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState({});

    async function handleRegister(e) {
        e.preventDefault();
        const res = await fetch('/api/register', {
            method: "post",
            body: JSON.stringify(formData),
        });

        const data = await res.json()

        if (data.errors) {
            setErrors(data.errors)
        } else {
            localStorage.setItem("token", data.token);
            setToken(data.token);
            navigate('/');
        }

        console.log(data);
    }

    return (
        <>
            <h1 className="">Register a new account</h1>

            <form onSubmit={handleRegister} className="">
                <div>
                    <TextInput  label="Name" type="text" placeholder="Name"
                           value={formData.name}
                           onChange={(e) => setFormData({
                               ...formData, name: e.target.value
                           })}/>
                    {errors.name && <p className="error">{errors.name[0]}</p>}
                    <Space h="md"/>
                </div>

                <div>
                    <TextInput label="Email" type="text" placeholder="Email"
                           value={formData.email}
                           onChange={(e) => setFormData({
                               ...formData, email: e.target.value
                           })}/>
                    {errors.email && <p className="error">{errors.email[0]}</p>}
                    <Space h="md"/>
                </div>

                <div>
                    <TextInput label="Password" type="password" placeholder="Password"
                           value={formData.password}
                           onChange={(e) => setFormData({
                               ...formData, password: e.target.value
                           })}/>
                    {errors.password && <p className="error">{errors.password[0]}</p>}
                    <Space h="md"/>
                </div>

                <div>
                    <TextInput label="Confirm Password" type="password" placeholder="Confirm Password"
                           value={formData.password_confirmation}
                           onChange={(e) => setFormData({
                               ...formData, password_confirmation: e.target.value
                           })}/>
                    <Space h="md"/>
                </div>

                <Button type="submit" variant="filled" color="green">Register</Button>
            </form>
        </>
    );
}