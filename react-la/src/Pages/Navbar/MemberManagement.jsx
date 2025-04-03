import {useContext, useEffect, useState, useRef, useCallback} from "react";
// import {useNavigate,} from "react-router-dom";
import {Button, TextInput,} from '@mantine/core';
import {AppContext} from "../../Context/AppContext.jsx";
import { useLoading } from "../../Context/LoadingContext.jsx";
import CreateModal from "../../components/Modals/CreateModal.jsx";
import ActionModal from "../../components/Modals/ActionModal.jsx";
import MembersTable from "../../components/MembersTable.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {notifications} from "@mantine/notifications";

// import  Axios from "axios";


export default function MemberManagement() {
    const [members, setMembers] = useState([]);
    const {user, token} = useContext(AppContext);
    const { startLoading, stopLoading, isLoading } = useLoading();
    const hasCalledApi = useRef(false);
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

    // สำหรับการทำ Paginate
    const [filteredMembers, setFilteredMembers] = useState(members); // ผลลัพธ์การ search

    const [activePage, setActivePage] = useState(1); // หน้า Paginate ที่กำหนด
    const itemsPerPage = 6; // จำนวนสมาชิกต่อหน้า

    // คำนวณความยาวหน้า
    // const totalMembers = members.length;
    // const totalPages = Math.ceil(totalMembers / itemsPerPage);

    // คำนวณเริ่มต้นและสิ้นสุดของหน้า
    const startIndex = (activePage - 1) * itemsPerPage;
    const currentMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

    // ฟังค์ชั่นสำหรับเปลี่ยนหน้า
    const handlePageChange = (page) => {
        setActivePage(page);
    }

    // สำหรับ การตรวจสอบ user กรอก หมายเลขโทรศัพท์
    const isValidPhoneNumber = (phone) => {
        const phoneRegex = /^(?:\+?\d{1,3})?[-.\s]?(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{4})$/;
        return phoneRegex.test(phone);
    }

    // สำหรับ การตัด - และช่องว่าง ออกจากหมายเลขโทรศัพท์แล้วค่อยจัดเก็บ
    const formatPhoneNumber = (phone) => {
        return phone.replace(/[-\s]/g, '');
    }

    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    const [formData, setFormData] = useState({
        member_name: "",
        age: 0,
        gender: "",
        phone_number: "",
        email: "",
        address: "",
        notes: "",
        profile_picture: null,
        membership_type: "",
        expiration_date: "",
    });
    const [membershipType, setMembershipType] = useState('')
    const [errors, setErrors] = useState({});



    // const navigate = useNavigate();
    // สร้าง getMembers function ด้วย useCallback เพื่อป้องกัน infinite loop
    const getMembers = useCallback(async () => {
        // ตรวจสอบว่าได้เรียก API ไปแล้วหรือยัง ถ้าเรียกแล้วให้ return ออกไปเลย
        if (hasCalledApi.current) {
            return;
        }
        
        try {
            startLoading(); // เริ่ม loading state
            const res = await fetch(`${API_URL}/api/members`)
            const data = await res.json();

            if (res.ok) {
                setMembers(data);
                setFilteredMembers(data);
                hasCalledApi.current = true; // ตั้งค่าเป็น true เพื่อบอกว่าได้เรียก API แล้ว
            }
        } catch (error) {
            console.error("Error fetching members:", error);
            hasCalledApi.current = false; // ถ้าเกิดข้อผิดพลาด ให้ reset เพื่อให้สามารถลองใหม่ได้
        } finally {
            stopLoading(); // หยุด loading state ไม่ว่าจะสำเร็จหรือเกิดข้อผิดพลาด
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // ลบ dependencies เพื่อป้องกัน infinity loop

    const handleSearch = (query) => {
        const lowerQuery = query.toLowerCase();
        if (query === "") {
            setFilteredMembers(members); // คืนค่าข้อมูลทั้งหมด
        } else {
            const filteredResults = members.filter(member =>
                member.member_name.toLowerCase().includes(lowerQuery) ||
                member.user.name.toLowerCase().includes(lowerQuery) ||
                member.id.toString().includes(lowerQuery) ||
                member.email.toLowerCase().includes(lowerQuery) ||
                member.membership_type.toLowerCase().includes(lowerQuery)
            );
            setFilteredMembers(filteredResults); // อัปเดทผลการค้นหา
        }
        // สำหรับรีเซ็ทหน้าไปที่ 1 หลังการค้นหา เพราะเคยเกิดเหตุการณ์ อยู่หน้าอื่นแล้วแจ้งว่าไม่พบ ทั้งๆที่พบแล้วแต่มันอยู๋หน้าที่1
        setActivePage(1);
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

            startLoading(); // เริ่ม loading state

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
                    setErrors({profile_picture: ["Failed to attach profile picture."]});
                    return;

                }
            }

            // ส่งข้อมูลไปยัง Back-end
            const res = await fetch(`${API_URL}/api/members`, {
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
        } finally {
            stopLoading(); // หยุด loading state ไม่ว่าจะสำเร็จหรือเกิดข้อผิดพลาด
        }
    }

// Validation Function for Front-end แบบแยกต่างหาก
    function validateFormData(formData) {
        const errors = {};
        if (!formData.member_name || formData.member_name.trim() === "") {
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
        console.log("Resetting formData...");
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
        setSelectedFileName("Profile Picture here");
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

        try {
            startLoading(); // เริ่ม loading state
            // สร้างข้อมูล JSON เพื่อส่งไปยัง Back-end
            const payload = {
                member_name: memberToEdit.member_name,
                age: memberToEdit.age,
                gender: memberToEdit.gender,
                phone_number: formatPhoneNumber(memberToEdit.phone_number),
                email: memberToEdit.email,
                address: memberToEdit.address || null,
                notes: memberToEdit.notes || null,
                membership_type: memberToEdit.membership_type,
                expiration_date: memberToEdit.expiration_date,
            };

            // ส่งข้อมูลไปยัง back-end
            console.log(`Fetching URL: ${API_URL}/api/members/${memberToEdit.id}`);
            const res = await fetch(`${API_URL}/api/members/${memberToEdit.id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json", // ใช้ JSON เฉพาะตอนที่อยากจัดการสิ่งที่ไม่เกี่ยวข้องกับอัพโหลดไฟล์
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
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
            setEditModalOpened(false);
            setMessage("Member updated successfully.");
            setOpened(true);
            resetFormData(); // รีเซ็ตฟอร์ม
            hasCalledApi.current = false; // Reset เพื่อให้สามารถโหลดข้อมูลใหม่ได้
            getMembers(); // รีเฟรชรายการสมาชิก
        } catch (error) {
            console.error("An unexpected error occurred:", error);
            setErrors({updateError: ["An unexpected error occurred."]});
        } finally {
            stopLoading(); // หยุด loading state ไม่ว่าจะสำเร็จหรือเกิดข้อผิดพลาด
        }
    }

    const handleProfilePictureUpload = (file, memberId) => {
        const formData = new FormData();
        formData.append("profile_picture", file);
        formData.append("member_id", memberId);

        startLoading(); // เริ่ม loading state

        fetch(`${API_URL}/api/upload-profile-picture`, {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })

            .then((data) => {
                console.log("Upload successful:", data);


                // setSelectedMember((prev) => ({
                //     ...prev,
                //     profile_picture: data.profile_picture,
                // }));

                // อัปเดตรูปใน state ของสมาชิกทั้งหมด
                setMembers((prevMembers) =>
                    prevMembers.map((member) =>
                        member.id === memberId
                            ? {...member, profile_picture: data.profile_picture}
                            : member
                    )
                );

                // อัปเดท selectedMember
                setSelectedMember((prev) => ({
                    ...prev,
                    profile_picture: data.profile_picture,
                }));


                notifications.show({
                    title: "Success",
                    message: "Profile picture updated successfully.",
                    color: "green",
                });
                stopLoading(); // หยุด loading state เมื่อสำเร็จ
            })
            .catch((error) => {
                console.error("Upload failed:", error);
                notifications.show({
                    title: "Error",
                    message: "Failed to update profile picture. Please try again.",
                    color: "red",
                });
                stopLoading(); // หยุด loading state เมื่อเกิดข้อผิดพลาด
            });
    };


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
        try {
            startLoading(); // เริ่ม loading state
            const res = await fetch(`${API_URL}/api/members/${memberToDelete}`, {
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
        } catch (error) {
            console.error("Error deleting member:", error);
        } finally {
            stopLoading(); // หยุด loading state ไม่ว่าจะสำเร็จหรือเกิดข้อผิดพลาด
        }
    }

    // ดึงข้อมูลสมาชิกเมื่อโหลดหน้า
    useEffect(() => {
        getMembers();
        
        // Cleanup function เมื่อ component unmount
        return () => {
            hasCalledApi.current = false; // Reset เมื่อ component unmount
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // ลบ getMembers จาก dependencies เพื่อป้องกัน infinity loop

    // อัปเดท filteredMembers เมื่อ members เปลี่ยน
    useEffect(() => {
        setFilteredMembers(members); // เชื่อม filteredMembers กับ members
    }, [members]);


    // สำหรับ รีเซ็ท errors เมื่อ Modal ปิดตัวลง
    useEffect(() => {
        if (!editModalOpened && !newMemberModalOpened) {
            setErrors({}); // อันนี้เอาไว้ รีเซ้ทสถานะ errors เมื่อ Modal สองอันนี้ไม่แสดง
        }
    }, [editModalOpened, newMemberModalOpened]);


    return (
        <>
            <h1 style={{marginTop: '50px'}}>Welcome to the Member Management</h1>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
            }}>
                <TextInput
                    placeholder="Search member..."
                    rightSection={
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            style={{fontSize: '16px', color: '#868e96'}}
                        />
                    }
                    size="sm"
                    radius="md"
                    style={{maxWidth: '600px'}}
                    onChange={(event) => handleSearch(event.target.value)}
                />

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
                handleProfilePictureUpload={handleProfilePictureUpload}
            />

            {/*สำหรับโหลด Table จาก component MembersTable*/}
            <MembersTable
                members={currentMembers}
                totalMembers={filteredMembers.length} // ส่งจำนวนสมาชิกทั้งหมด หลังกรองแล้ว
                itemsPerPage={itemsPerPage}
                activePage={activePage}
                onPageChange={handlePageChange}
                handleReadMore={handleReadMore}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                isLoading={isLoading}
            />
        </>
    );
}
