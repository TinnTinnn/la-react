import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AppContext} from "../../Context/AppContext.jsx";
import {TextInput, Space, Button, } from "@mantine/core";

export default function Login() {
    const {setToken} = useContext(AppContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

    async function handleLogin(e) {
        e.preventDefault();
        const res = await fetch('/api/login', {
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
            <h1 className="">Login to your account</h1>

            <form onSubmit={handleLogin} className="">
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
                <Button type="submit">Login</Button>
            </form>
        </>
    );
}