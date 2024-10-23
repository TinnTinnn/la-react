import {useContext, useState} from "react";
import {AppContext} from "../../Context/AppContext.jsx";
import {useNavigate} from "react-router-dom";
import {TextInput, Space, Button, NativeSelect } from "@mantine/core";

import '@mantine/dates/styles.css'
import {DatePickerInput} from "@mantine/dates";


export default function Create() {
    const navigate = useNavigate();
    const {token} = useContext(AppContext)
    const [membershipType, setMembershipType] = useState('')
    const [formData, setFormData] = useState({
        user_id: "",
        member_name: "",
        membership_type: "",
        expiration_date: "",
    });

    const [errors, setErrors] = useState({});

    async function handleCreate(e) {
        e.preventDefault();
        const res = await fetch('/api/members', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await res.json()


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
    return (
        <>
            <form onSubmit={handleCreate} className="">
                <div>
                    <TextInput label="User ID" placeholder="Your id here"
                               value={formData.user_id}
                               onChange={(e) =>
                                   setFormData({...formData, user_id: e.target.value})}/>
                    {errors.user_id && <p className="error">{errors.user_id[0]}</p>}
                    <Space h="md"/>
                </div>

                <div>
                    <TextInput label="Member Name" placeholder="Your member name here"
                               value={formData.member_name}
                               onChange={(e) =>
                                   setFormData({...formData, member_name: e.target.value})}/>
                    {errors.member_name && <p className="error">{errors.member_name[0]}</p>}
                    <Space h="md"/>
                </div>

                <div>
                    <NativeSelect
                        label="Membership Type"  // ตรงนี้จะเพิ่ม label ให้แสดง
                        
                        value={membershipType}
                        onChange={handleSelectChange}
                        data={[
                            {value: '', label: 'Select type', disabled: true},
                            {value: 'Platinum', label: 'Platinum'},
                            {value: 'Gold', label: 'Gold'},
                            {value: 'Silver', label: 'Silver'},
                            {value: 'Bronze', label: 'Bronze'},
                        ]}
                        placeholder="Select membership type" // แสดง placeholder
                    />
                    {errors.membership_type && <p className="error">{errors.membership_type[0]}</p>}
                    <Space h="md"/>
                </div>

                <div>
                    <DatePickerInput
                        label="Pick date"
                        placeholder="expiration date"
                        value={formData.expiration_date ? new Date(formData.expiration_date) : null}
                        onChange={(date) =>
                            setFormData({
                                ...formData,
                                expiration_date: date ? date.toISOString().split("T")[0] : ""
                            })}/>
                    {errors.expiration_date && <p className="error">{errors.expiration_date[0]}</p>}
                    <Space h="md"/>
                </div>

                <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px',}}>
                    <Button rightSection type="submit" variant="filled" color="green">Create</Button>
                </div>
            </form>
        </>
    );
}