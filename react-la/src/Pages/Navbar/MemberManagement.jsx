import {useContext, useEffect, useState} from "react";
// import {useNavigate,} from "react-router-dom";
import {Button,} from '@mantine/core';
import {AppContext} from "../../Context/AppContext.jsx";
import CreateModal from "../../components/Modals/CreateModal.jsx";
import ActionModal from "../../components/Modals/ActionModal.jsx";
import MembersTable from "../../components/MembersTable.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserPlus} from "@fortawesome/free-solid-svg-icons";
// import  Axios from "axios";


export default function MemberManagement() {
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


    // สำหรับ การตรวจสอบ user กรอก หมายเลขโทรศัพท์
    const isValidPhoneNumber = (phone) => {
        const phoneRegex = /^(?:\+?\d{1,3})?[-.\s]?(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{4})$/;
        return phoneRegex.test(phone);
    }

    // สำหรับ การตัด - และช่องว่าง ออกจากหมายเลขโทรศัพท์แล้วค่อยจัดเก็บ
    const formatPhoneNumber = (phone) => {
        return phone.replace(/[-\s]/g, '');
    }

    const [formData, setFormData] = useState({
        member_name: "",
        age: 0,
        gender: "",
        phone_number: "",
        email: "",
        address: "",
        notes: "",
        profile_picture: "",
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

        // console.log('User  :', user); // ตรวจสอบค่าของ user
        console.log('formData Before sent :', formData); // ตรวจสอบค่า formData ก่อนส่ง

        try {
            // ส่วน Front-end validate
            const validationErrors = validateFormData(formData);
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            // รีฟอแมท์หมายเลขโทรศัพท์ก่อนเก็บ และ เตรียมพร้อมข้อมูลเพื่อส่ง
            const formDataToSend = new FormData();
            formDataToSend.append('user_id', user.id);
            formDataToSend.append('member_name', formData.member_name);
            formDataToSend.append('age', formData.age);
            formDataToSend.append('gender', formData.gender);
            formDataToSend.append('phone_number', formatPhoneNumber(formData.phone_number));
            formDataToSend.append('email', formData.email);
            formDataToSend.append('address', formData.address);
            formDataToSend.append('notes', formData.notes);
            formDataToSend.append('membership_type', formData.membership_type);
            formDataToSend.append('expiration_date', formData.expiration_date);

            if (formData.profile_picture) {
                formDataToSend.append('profile_picture', formData.profile_picture);
            }


            // ส่งข้อมูลไปยัง Back-end
            const res = await fetch(`/api/members`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                // ต้องระบุ Content-Type เป็น 'application/json' ถ้าไม่มีการแนบไฟล์
                // 'Content-Type': 'application/json',
                body: formDataToSend,// ใช้อันนี้เพื่อรองรับข้อมูลที่เป็น multipart
                // body: JSON.stringify(memberData), // แปลงข้อมูลเป็น JSON string ถ้าไม่อัพโหลดไฟล์
            });

            console.log('FormData:', formData);
            const data = await res.json();
            console.log('Response data:', data); // เอาไว้ดูค่า response ที่ส่งกลับมาจาก Back

            if (!res.ok) {
                // สำหรับ handle ฝั่ง Back-end validation Errors
                if (data.errors) {
                    setErrors(data.errors);
                }
                return;
            }

            // ถ้า สร้างสำเร็จ ให้ทำอะไร
            setNewMemberModalOpened(false);
            getMembers(); // Refresh members list
            setMessage("New member has been created successfully.");
            setOpened(true);
            resetFormData();
        } catch (error) {
            console.error("An unexpected error occurred:", error);
        }
    }

// Validation Function for Front-end แบบแยกต่างหาก
    function validateFormData(formData) {
        const errors = {};
        if (!formData.member_name.trim()) errors.member_name = ["Member name is required."];
        if (!formData.age || formData.age <= 0) errors.age = ["Age is required and must be positive."];
        if (!formData.gender) errors.gender = ["Gender is required."];
        if (!formData.email) errors.email = ["Email is required."];
        if (!formData.phone_number) {
            errors.phone_number = ["Phone number is required."];
        } else if (!isValidPhoneNumber(formData.phone_number)) {
            errors.phone_number = ["Phone number is not valid."];
        }
        if (!formData.membership_type) errors.membership_type = ["Membership type is required."];
        if (!formData.expiration_date) errors.expiration_date = ["Expiration date is required."];
        return errors;
    }

    // Reset formData and errors แบบแยกต่างหาก
    function resetFormData() {
        setFormData({
            member_name: "",
            age: null,
            gender: "",
            phone_number: "",
            email: "",
            address: "",
            notes: "",
            profile_picture: null,
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

        // แจ้งใน Log ว่า Update member
        console.log("Updating member:", memberToEdit);

        // การตรวจสอบเบอร์โทรศัพท์
        let newErrors = {};
        if (memberToEdit.member_name.trim() === "") {
            newErrors.member_name = ["Member name is required."];
        }

        if (memberToEdit.age === null) {
            newErrors.age = ["Age is required."];
        }

        if (memberToEdit.gender === "") {
            newErrors.gender = ["Gender is required."];
        }

        if (memberToEdit.email === "") {
            newErrors.email = ["Email is required."];
        }

        if (memberToEdit.phone_number === "") {
            newErrors.phone_number = ["Phone number is required."];
        } else if (!isValidPhoneNumber(memberToEdit.phone_number)) { // เมื่อผ่านการกรอกเบอร์แล้วแต่ format ไม่ถูกต้อง จะแจ้งเตือน
            newErrors.phone_number = ["Phone number is not valid."];
        }

        if (memberToEdit.membership_type === "") {
            newErrors.membership_type = ["Membership type is required."];
        }

        if (memberToEdit.expiration_date === "") {
            newErrors.expiration_date = ["Expiration date is required."];
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return; // หยุดการทำงานหากมีข้อผิดพลาด
        }

        // จัดรูปแบบหมายเลขโทรศัพท์
        const formattedPhoneNumber = formatPhoneNumber(memberToEdit.phone_number);
        const updatedMemberData = {
            ...memberToEdit,
            phone_number: formattedPhoneNumber, // ใช้หมายเลขโทรศัพท์ที่จัดรูปแบบแล้ว
        };


        const res = await fetch(`/api/members/${memberToEdit.id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedMemberData),
        });

        const data = await res.json()
        console.log('Response data:', data);


        if (res.ok) {
            setEditModalOpened(false);  // ปิด Modal
            getMembers();  // รีเฟรชรายการ members
            setMessage("Your information has been updated.");
            setOpened(true);// เปิด Modal แสดงข้อความ
        } else {
            const data = await res.json();

            if (data.errors && data.errors.member_name) {
                newErrors.member_name = data.errors.member_name;
            }

            if (data.errors && data.errors.phone_number) {
                newErrors.phone_number = data.errors.phone_number;
            }

            if (data.errors && data.errors.email) {
                newErrors.email = data.errors.email;
            } else {
                console.log(data);  // handle error response
            }
            setErrors(newErrors);
        }
    }

    // async function handleUploadImg(file){
    //     try {
    //         const formData = new FormData();
    //         formData.append('profile_picture', file);
    //
    //         const res =await Axios.post(`/api/members`, formData, {
    //             header: {
    //                 Authorization: `Bearer ${token}`,
    //                 'Content-Type': 'multipart/form-data', // เพื่อให้ server เข้าใจว่าเป็นการส่งไฟล์
    //             },
    //         });
    //
    //         const data =res.data;
    //         if (res.status === 200) {
    //             setMessage("Profile picture uploaded successfully.");
    //             setOpened(true);
    //             return data.filepath; // ส่ง path ของรูปภาพที่ถูกอัปโหลดกลับมา
    //         } else {
    //             setMessage("Failed to upload profile picture.");
    //             setOpened(true);
    //         }
    //     } catch (error) {
    //         console.error("An error occurred during image upload:", error);
    //         setMessage("An error occurred during image upload.");
    //         setOpened(true);
    //     }
    // }


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
        getMembers(); // ดึงข้อมูลสมาชิก
    }, []);

    // สำหรับ รีเซ็ท errors เมื่อ Modal ปิดตัวลง
    useEffect(() => {
        if (!editModalOpened && !newMemberModalOpened) {
            setErrors({}); // อันนี้เอาไว้ รีเซ้ทสถานะ errors เมื่อ Modal สองอันนี้ไม่แสดง
        }
    }, [editModalOpened, newMemberModalOpened]);


    return (
        <>
            <h1 style={{marginTop: '50px'}}>Welcome to the Member Management</h1>

            <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px',}}>
                {user ? (
                    <Button
                        leftSection={<FontAwesomeIcon icon={faUserPlus}/>}
                        onClick={() => setNewMemberModalOpened(true)}>

                        New Member
                    </Button>
                ) : (
                    "" // หากไม่ได้ Log in จะไม่เห็นปุ่ม New member
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
                errors={errors}
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

