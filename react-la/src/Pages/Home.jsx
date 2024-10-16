import {useContext, useEffect, useState} from "react";
// import {useNavigate,} from "react-router-dom";
import {Button, } from '@mantine/core';
import {AppContext} from "../Context/AppContext.jsx";
import CreateModal from "../components/Modals/CreateModal.jsx";
import ActionModal from "../components/Modals/ActionModal.jsx";
import MembersTable from "../components/MembersTable.jsx";


export default function Home() {
    const [members, setMembers] = useState([]);
    const {user, token} = useContext(AppContext);
    const [message, setMessage] = useState(null);
    const [opened, setOpened] = useState(false);
    const [confirmModalOpened, setConfirmModalOpened] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);
    const [newMemberModalOpened, setNewMemberModalOpened] = useState(false);
    const [readMoreModalOpened, setReadMoreModalOpened] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [editModalOpened, setEditModalOpened] = useState(false);
    const [memberToEdit, setMemberToEdit] = useState(null);
    const [formData, setFormData] = useState({
        member_name: "",
        membership_type: "",
        expiration_date: "",
    });
    const [membershipType, setMembershipType] = useState('')
    const [errors, setErrors] = useState({});
    // const navigate = useNavigate();
    async function getMembers() {
        const res = await fetch('/api/members')
        const data = await res.json();

        if (res.ok) {
            setMembers(data)
        }
    }

    async function handleCreate(e) {
        e.preventDefault();

        const newErrors = {};

        if (formData.member_name.trim() === "") {
            newErrors.member_name = ["Member name is required."];
        }

        if (formData.membership_type === "") {
            newErrors.membership_type = ["Membership type is required."];
        }

        if (formData.expiration_date === "") {
            newErrors.expiration_date = ["Expiration date is required."];
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return; // หยุดการทำงานหากมีข้อผิดพลาด
        }

        const res = await fetch('/api/members', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...formData,
                user_id: user.id,
            }),
        });

        const data = await res.json()


        if (data.errors) {
            setErrors(data.errors)
        } else {
            setNewMemberModalOpened(false);
            getMembers();
            setMessage("New member has been created successfully.");
            setOpened(true);
        }

        setFormData({
            member_name: "",
            membership_type: "",
            expiration_date: "",
        });
        setErrors({});
    }


    function handleEdit(id) {
        const member = members.find(member => member.id === id);

        if (user && member && user.id === member.user_id) {
            setMemberToEdit(member);
            setEditModalOpened(true);
        } else {
            setMessage("You don't have permission to do this.");
            setOpened(true);
        }
    }

    async function handleEditFormSubmit(e) {
        e.preventDefault();

        const res = await fetch(`/api/members/${memberToEdit.id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(memberToEdit),
        });

        if (res.ok) {
            setEditModalOpened(false);  // ปิด Modal
            getMembers();  // รีเฟรชรายการ members
            setMessage("Your information has been updated.");
            setOpened(true);// เปิด Modal แสดงข้อความ
        } else {
            const data = await res.json();
            console.log(data);  // handle error response
        }
    }

    async function handleDelete(id) {
        const member = members.find(member => member.id === id);
        // เช็ค if ถ้า  user เป็นเจ้าของ
        if (user && member && user.id === member.user_id) {
            setMemberToDelete(id);
            setConfirmModalOpened(true);
        } else {
            setMessage("You don't have permission to do this.");
            setOpened(true);
        }
    }

    function handleReadMore(member) {
        setSelectedMember(member);
        setReadMoreModalOpened(true);
    }

    async function confirmDelete() {
        if (!memberToDelete) return
        const res = await fetch(`/api/members/${memberToDelete}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,  // ใช้ Token สำหรับการ Auth
                'Content-Type': 'application/json'
            }
        });

        if (res.ok) {
            if (res.status === 204) {
                setMessage('Member deleted successfully.');
                setOpened(true);
                // Update member เมื่อลบแล้ว
                setMembers(members.filter(member => member.id !== memberToDelete));
            } else {
                const data = await res.json();
                console.log(data);
            }
        } else {
            const errorData = await res.json();
            console.log(errorData);
        }
        setConfirmModalOpened(false);
        setMemberToDelete(null);
    }

    useEffect(() => {
        getMembers();
    }, []);


    return (
        <>
            <h1>Welcome to the Member Management</h1>

            <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px',}}>
                {user ? (
                    <Button onClick={() => setNewMemberModalOpened(true)}>New Member</Button>
                ) : (
                    ""
                )}
            </div>

            {/*สำหรับปุ่ม New Member จาก Component CreateModal*/}
            <CreateModal
                opened={newMemberModalOpened}
                onClose={() => setNewMemberModalOpened(false)}
                onSubmit={handleCreate}
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                membershipType={membershipType}
                setMembershipType={setMembershipType}
            />

            {/*สำหรับปุ่ม Action จาก component ActionModal*/}
            <ActionModal
                opened={opened}
                setOpened={setOpened}
                message={message}
                confirmModalOpened={confirmModalOpened}
                setConfirmModalOpened={setConfirmModalOpened}
                confirmDelete={confirmDelete}
                readMoreModalOpened={readMoreModalOpened}
                setReadMoreModalOpened={setReadMoreModalOpened}
                selectedMember={selectedMember}
                editModalOpened={editModalOpened}
                setEditModalOpened={setEditModalOpened}
                memberToEdit={memberToEdit}
                setMemberToEdit={setMemberToEdit}
                handleEditFormSubmit={handleEditFormSubmit}
            />

            {/*สำหรับโหลด Table จาก component MembersTable*/}
            <MembersTable
                members={members}
                handleReadMore={handleReadMore}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
        </>
    );
}

