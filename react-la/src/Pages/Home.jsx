import {useContext, useEffect, useState} from "react";
import {useNavigate,} from "react-router-dom";
import {Table, Button, Modal, Menu, rem, TextInput, Space, NativeSelect} from '@mantine/core';
import {AppContext} from "../Context/AppContext.jsx";
import {IconChevronDown, IconMessage, IconSettings, IconTrash} from "@tabler/icons-react";
import {DatePickerInput} from "@mantine/dates";


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
    const navigate = useNavigate();

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
        }

        setFormData({
            member_name: "",
            membership_type: "",
            expiration_date: "",
        });
        setErrors({});
    }

    const handleSelectChange = (e) => {
        setMembershipType(e.target.value);
        setFormData({...formData, membership_type: e.target.value});
    };

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
            <h1>Latest Members</h1>

            <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px',}}>
                {user ? (
                    <Button onClick={() => setNewMemberModalOpened(true)}>New Member</Button>
                ) : (
                    ""
                )}
            </div>

            <Modal
                opened={newMemberModalOpened}
                onClose={() => setNewMemberModalOpened(false)}
                title="Create New Member"
                centered
            >
                <form onSubmit={handleCreate} className="">
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
                            rightSection={<IconChevronDown size={14} stroke={1.5}/>}
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
            </Modal>

            <Modal
                opened={opened}
                onClose={() => setOpened(false)} // ปิด Modal
                title={<span style={{color: 'red'}}>Alert</span>}
                centered
            >
                {message}
            </Modal>
            <Modal
                opened={confirmModalOpened}
                onClose={() => setConfirmModalOpened(false)}
                title={<span style={{color: 'red'}}>Confirm Delete</span>}
                centered
            >
                <p>Are you sure you want to delete this member?</p>
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button color="red" onClick={confirmDelete}>Confirm</Button> &nbsp;
                    <Button onClick={() => setConfirmModalOpened(false)}>Cancel</Button>
                </div>
            </Modal>
            <Modal opened={readMoreModalOpened}
                   onClose={() => setReadMoreModalOpened(false)}
                   title="Member Information"
                   centered
            >
                {selectedMember && (
                    <div>
                        <p><strong>ID:</strong> {selectedMember.id}</p>
                        <p><strong>Member Name:</strong> {selectedMember.member_name}</p>
                        <p><strong>Membership Type:</strong> {selectedMember.membership_type}</p>
                        <p><strong>Created By:</strong> {selectedMember.user.name}</p>
                        <p><strong>User ID:</strong> {selectedMember.user.id}</p>
                        <p><strong>Email:</strong> {selectedMember.user.email}</p>
                        <p><strong>Created At:</strong> {new Date(selectedMember.created_at).toLocaleString()}</p>
                    </div>
                )}
            </Modal>

            <Modal
                opened={editModalOpened}
                onClose={() => setEditModalOpened(false)}
                title="Edit Member Information"
                centered
            >
                {memberToEdit && (
                    <form onSubmit={(e) => handleEditFormSubmit(e)}>
                        <div>
                            <TextInput
                                label="Member Name"
                                value={memberToEdit.member_name}
                                onChange={(e) =>
                                    setMemberToEdit({...memberToEdit, member_name: e.target.value})
                                }
                            />
                        </div>

                        <div>
                            <NativeSelect
                                label="Membership Type"
                                value={memberToEdit.membership_type}
                                onChange={(e) =>
                                    setMemberToEdit({...memberToEdit, membership_type: e.target.value})
                                }
                                data={[
                                    {value: 'Platinum', label: 'Platinum'},
                                    {value: 'Gold', label: 'Gold'},
                                    {value: 'Silver', label: 'Silver'},
                                    {value: 'Bronze', label: 'Bronze'},
                                ]}
                            />
                        </div>

                        <div>
                            <DatePickerInput
                                label="Pick expiration date"
                                value={memberToEdit.expiration_date ? new Date(memberToEdit.expiration_date) : null}
                                onChange={(date) =>
                                    setMemberToEdit({
                                        ...memberToEdit,
                                        expiration_date: date ? date.toISOString().split("T")[0] : ""
                                    })
                                }
                            />
                        </div>

                        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '20px'}}>
                            <Button type="submit" variant="filled" color="green">Save Changes</Button>
                        </div>
                    </form>
                )}
            </Modal>
            {members.length > 0 ? (
                <Table striped highlightOnHover withTableBorder className="text-center">
                    <Table.Tr>
                        <Table.Th>ID</Table.Th>
                        <Table.Th>User ID</Table.Th>
                        <Table.Th>Member Name</Table.Th>
                        <Table.Th>Member Type</Table.Th>
                        <Table.Th>Created By</Table.Th>
                        <Table.Th>Created At</Table.Th>
                        <Table.Th>Email</Table.Th>
                        <Table.Th>Action</Table.Th>
                    </Table.Tr>
                    <Table.Tbody>
                        {members.map((member) =>
                            <Table.Tr key={member.id}>
                                <Table.Td>{member.id}</Table.Td>
                                <Table.Td>{member.user_id}</Table.Td>
                                <Table.Td>{member.member_name}</Table.Td>
                                <Table.Td>{member.membership_type}</Table.Td>
                                <Table.Td>{member.user.name}</Table.Td>
                                <Table.Td>
                                    {new Date(member.created_at).toLocaleTimeString()} <br/>
                                    {new Date(member.created_at).toLocaleDateString()}
                                </Table.Td>
                                <Table.Td>{member.user.email}</Table.Td>
                                <Table.Td>
                                    <Menu shadow="md" width={200}>
                                        <Menu.Target>
                                            <Button>More</Button>
                                        </Menu.Target>

                                        <Menu.Dropdown>
                                            <Menu.Label>Application</Menu.Label>
                                            <Menu.Item
                                                onClick={() => handleReadMore(member)}
                                                leftSection={<IconMessage style={{width: rem(14), height: rem(14)}}/>}>
                                                Read more
                                            </Menu.Item>
                                            <Menu.Item
                                                leftSection={<IconSettings style={{width: rem(14), height: rem(14)}}/>}
                                                onClick={() => handleEdit(member.id)}
                                            >
                                                Edit
                                            </Menu.Item>
                                            <Menu.Label>Danger Zone</Menu.Label>
                                            <Menu.Item
                                                color="red"
                                                leftSection={<IconTrash style={{width: rem(14), height: rem(14)}}/>}
                                                onClick={() => handleDelete(member.id)}
                                            >
                                                Delete Member
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            ) : (
                <p className="text-center">There are no members</p>
            )}
        </>
    );
}

