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
    const [selectedFileName, setSelectedFileName] = useState("Profile Picture here");


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

            // เตรียมพร้อมข้อมูลเพื่อส่ง
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
                try {
                    // ทดลองอัพโหลดรูปภาพ
                    formDataToSend.append('profile_picture', formData.profile_picture);
                    console.log("Profile picture attached successfully:", formData.profile_picture.name);
                } catch (error) {
                    console.error("Error attaching profile picture:", error);
                    setErrors({ profile_picture: ["Failed to attach profile picture."]});
                    return;

                }
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
        if (!formData.member_name || formData.member_name.trim() === ""){
            errors.member_name = ["Member name is required."];
        }
        if (!formData.age || isNaN(formData.age)) {
            errors.age = ["Age is required and must be a number."];
        }
        if (!formData.gender || formData.gender === "") {
            errors.gender = ["Gender is required."];
        }
        if (!formData.phone_number || formData.phone_number.trim() === "") {
            errors.phone_number = ["Phone number is required."];
        } else if (!isValidPhoneNumber(formData.phone_number)) {
            errors.phone_number = ["Phone number is not valid."];
        }
        if (!formData.email || formData.email.trim() === "") {
            errors.email = ["Email is required."];
        }
        if (!formData.membership_type || formData.membership_type === "") {
            errors.membership_type = ["Membership type is required."];
        }
        if (!formData.expiration_date || formData.expiration_date === "") {
            errors.expiration_date = ["Expiration date is required."];
        }
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

        // ส่วน front-end validate
        const validationErrors = validateFormData(memberToEdit); // ใช้ validateFormData แบบเดียวกับ handleCreate
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; // หยุดการทำงานหากมีข้อผิดพลาด
        }

        // Prepare FormData
        const formDataToSend = new FormData();
        Object.keys(memberToEdit).forEach((key) => {
            if (memberToEdit[key] !== null && memberToEdit[key] !== "") {
                formDataToSend.append(key, memberToEdit[key]);
            }
        });

        // สร้าง FormData เพื่อส่งข้อมูล
        // const formDataToSend = new FormData();
        formDataToSend.append('member_name', memberToEdit.member_name);
        formDataToSend.append('age', memberToEdit.age);
        formDataToSend.append('gender', memberToEdit.gender);
        formDataToSend.append('phone_number', formatPhoneNumber(memberToEdit.phone_number));
        formDataToSend.append('email', memberToEdit.email);
        formDataToSend.append('address', memberToEdit.address);
        formDataToSend.append('notes', memberToEdit.notes);
        formDataToSend.append('membership_type', memberToEdit.membership_type);
        formDataToSend.append('expiration_date', memberToEdit.expiration_date);

        // ตรวจสอบว่ามีการอัปโหลดไฟล์ใหม่หรือไม่
        if (memberToEdit.profile_picture  instanceof File) {
            formDataToSend.append('profile_picture', memberToEdit.profile_picture);
        }

        for (let pair of formDataToSend.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }



        try {
            // ส่งข้อมูลไปยัง back-end
            console.log(`Fetching URL: /api/members/${memberToEdit.id}`);
            const res = await fetch(`/api/members/${memberToEdit.id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSend,
            });

            // ตรวจสอบการตอบสนองจากเซิร์ฟเวอร์
            if (!res.ok) {
                const errorText = await res.text();
                const errorData = JSON.parse(errorText);
                if (errorData.errors) {
                    setErrors(errorData.errors);
                }
                return;
            }


            // ถ้าอัปเดตสำเร็จ
            const data = await res.json();
            console.log("Updated member data:", data);
            setMessage("Member updated successfully.");
            setOpened(true);
            resetFormData(); // รีเซ็ตฟอร์ม
            getMembers(); // รีเฟรชรายการสมาชิก
        } catch (error) {
            console.error("An unexpected error occurred:", error);
            setErrors({ updateError: ["An unexpected error occurred."] });
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
                setSelectedFileName={setSelectedFileName}
                selectedFileName={selectedFileName}
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

