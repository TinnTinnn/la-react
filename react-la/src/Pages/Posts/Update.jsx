import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../Context/AppContext.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Modal, Menu, rem} from '@mantine/core';


export default function Update() {
    const {id} = useParams()
    const navigate = useNavigate();
    const {token, user} = useContext(AppContext)
    const [membershipType, setMembershipType] = useState('')
    const [formData, setFormData] = useState({
        user_id: "",
        membership_type: "",
        expiration_date: "",
    });

    const [errors, setErrors] = useState({});

    async function getMembers() {
        const res = await fetch(`/api/members/${id}`);
        const data = await res.json();

        if (res.ok) {
            if (data.member.user_id !== user.id) {
                navigate("/")
            }
            setFormData({
                user_id: data.member.user_id,
                membership_type: data.member.membership_type,
                expiration_date: data.member.expiration_date,
            })
        }
    }
    async function handleUpdate(e) {
        e.preventDefault();

        const res = await fetch(`/api/members/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await res.json()

        console.log(data)

        if (data.errors) {
            setErrors(data.errors)
        } else {
            navigate('/');
        }
    }

    const handleSelectChange = (e) => {
        setMembershipType(e.target.value);
        setFormData({...formData, membership_type: e.target.value});
    };

    useEffect(() => {
        getMembers()
    }, []);

    return (
        <>
            <h1 className="">Update Member</h1>

            <form onSubmit={handleUpdate} className="">
                <div>
                    <input type="text" placeholder="User id"
                           value={formData.user_id}
                           onChange={(e) =>
                               setFormData({...formData, user_id: e.target.value})}/>
                    {errors.user_id && <p className="error">{errors.user_id[0]}</p>}
                </div>

                <div>
                    <select value={membershipType} onChange={handleSelectChange}>
                        <option value="" disabled>Select MemberShip type</option>
                        <option value="Platinum">Platinum</option>
                        <option value="Gold">Gold</option>
                        <option value="Silver">Silver</option>
                        <option value="Bronze">Bronze</option>
                    </select>
                    {errors.membership_type && <p className="error">{errors.membership_type[0]}</p>}
                </div>

                <div>
                    <input type="date" placeholder="expiration date" value={formData.expiration_date}
                           onChange={(e) =>
                               setFormData({...formData, expiration_date: e.target.value})}/>
                    {errors.expiration_date && <p className="error">{errors.expiration_date[0]}</p>}
                </div>

                <button className="">Update</button>
            </form>
        </>
    );
}