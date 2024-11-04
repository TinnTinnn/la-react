import {useContext, useEffect, useState} from "react";
// import {useNavigate,} from "react-router-dom";
import {Button,} from '@mantine/core';
import {AppContext} from "../../Context/AppContext.jsx";
import CreateModal from "../../components/Modals/CreateModal.jsx";
import ActionModal from "../../components/Modals/ActionModal.jsx";
import MembersTable from "../../components/MembersTable.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserPlus} from "@fortawesome/free-solid-svg-icons";


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
        age: null,
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

    // async function handleCreate(e) {
    //     e.preventDefault();
    //
    //     try {
    //
    //         const newErrors = {};
    //
    //         if (formData.member_name.trim() === "") {
    //             newErrors.member_name = ["Member name is required."];
    //         }
    //
    //         if (formData.age === null) {
    //             newErrors.age = ["Age is required."];
    //         }
    //
    //         if (formData.gender === "") {
    //             newErrors.gender = ["Gender is required."];
    //         }
    //
    //         if (formData.email === "") {
    //             newErrors.email = ["Email is required."];
    //         }
    //
    //         if (formData.phone_number === "") {
    //             newErrors.phone_number = ["Phone number is required."];
    //         } else if (!isValidPhoneNumber(formData.phone_number)) { // เมื่อผ่านการกรอกเบอร์แล้วแต่ format ไม่ถูกต้อง จะแจ้งเตือน
    //             newErrors.phone_number = ["Phone number is not valid."];
    //         }
    //
    //         if (formData.membership_type === "") {
    //             newErrors.membership_type = ["Membership type is required."];
    //         }
    //
    //         if (formData.expiration_date === "") {
    //             newErrors.expiration_date = ["Expiration date is required."];
    //         }
    //
    //         if (Object.keys(newErrors).length > 0) {
    //             setErrors(newErrors);
    //             return; // หยุดการทำงานหากมีข้อผิดพลาด
    //         }
    //
    //         // เรียกใช้ ฟังค์ชั่น formatPhoneNumber ส่วนนี้หลังจากได้รับหมายเลขโทรศัพท์มาแล้ว
    //         const formattedPhoneNumber = formatPhoneNumber(formData.phone_number);
    //
    //         const res = await fetch('/api/members', {
    //             method: 'POST',
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 ...formData,
    //                 phone_number: formattedPhoneNumber,
    //                 user_id: user.id,
    //             }),
    //         });
    //
    //         const data = await res.json()
    //
    //
    //
    //         if (!res.ok) {
    //             if (data.errors) {
    //                 setErrors(data.errors); // จัดการ errors จาก backend
    //                 return;
    //             }
    //         } else {
    //             setNewMemberModalOpened(false);
    //             getMembers();
    //             setMessage("New member has been created successfully.");
    //             setOpened(true);
    //         }
    //
    //         setFormData({
    //             member_name: "",
    //             age: "",
    //             gender: "",
    //             phone_number: "",
    //             email: "",
    //             address: "",
    //             notes: "",
    //             profile_picture: "",
    //             membership_type: "",
    //             expiration_date: "",
    //         });
    //         setErrors({});
    //     } catch (error) {
    //         if (error.response && error.response.data.errors) {
    //             setErrors(error.response.data.errors);
    //         } else {
    //             console.error ("An unexpected error occurred:", error);
    //         }
    //     }
    //
    // }

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

    async function handleMemberFormSubmit(e, isEdit = false)  {
        e.preventDefault();

        // แจ้งใน Log ว่า Update member
        console.log(isEdit ? "Updating member:" : "Creating member:", memberToEdit || formData);

        // การตรวจสอบเบอร์โทรศัพท์
        let newErrors = {};
        const dataToValidate = isEdit ? memberToEdit : formData;

        if (dataToValidate.member_name.trim() === "") {
            newErrors.member_name = ["Member name is required."];
        }

        if (dataToValidate.age === null) {
            newErrors.age = ["Age is required."];
        }

        if (dataToValidate.gender === "") {
            newErrors.gender = ["Gender is required."];
        }

        if (dataToValidate.email === "") {
            newErrors.email = ["Email is required."];
        }

        if (dataToValidate.phone_number === "") {
            newErrors.phone_number = ["Phone number is required."];
        } else if (!isValidPhoneNumber(dataToValidate.phone_number)) { // เมื่อผ่านการกรอกเบอร์แล้วแต่ format ไม่ถูกต้อง จะแจ้งเตือน
            newErrors.phone_number = ["Phone number is not valid."];
        }

        if (dataToValidate.membership_type === "") {
            newErrors.membership_type = ["Membership type is required."];
        }

        if (dataToValidate.expiration_date === "") {
            newErrors.expiration_date = ["Expiration date is required."];
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return; // หยุดการทำงานหากมีข้อผิดพลาด
        }

        // จัดรูปแบบหมายเลขโทรศัพท์
        const formattedPhoneNumber = formatPhoneNumber(dataToValidate.phone_number);
        const updatedMemberData = {
            ...dataToValidate,
            phone_number: formattedPhoneNumber, // ใช้หมายเลขโทรศัพท์ที่จัดรูปแบบแล้ว
            user_id: isEdit ? undefined : user.id, // ไม่ต้องส่ง user_id เมื่อแก้ไข
        };

        if (!isEdit) {
            updatedMemberData.user_id = user.id;
        }


        try {
            // ใช้เงื่อนไขเพื่อตรวจตสอบว่ากำลังแก้ไขหรือสร้าง
            const res = await fetch(
                isEdit ? `/api/members/${dataToValidate.id}` : '/api/members',
                {
                    method: isEdit ? 'PUT' : 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedMemberData),
                });


            if (res.ok) {
                setEditModalOpened(false);

                getMembers();  // รีเฟรชรายการ members
                setMessage("Your information has been updated.");
                setOpened(true);// เปิด Modal แสดงข้อความ


                // รีเซ็ตฟอร์มหลังจากสร้างหรือแก้ไขสมาชิกใหม่สำเร็จ
                setFormData({
                    member_name: "",
                    age: "",
                    gender: "",
                    phone_number: "",
                    email: "",
                    address: "",
                    notes: "",
                    profile_picture: "",
                    membership_type: "",
                    expiration_date: "",
                });
                setErrors({});
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
        } catch (error) {
            console.error("An error occurred while submitting the form:", error)
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
                onSubmit={(e) => handleMemberFormSubmit(e, false)} // ส่ง false เพื่อระบุว่าเป็นการสร้าง
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
                handleMemberFormSubmit={(e) => handleMemberFormSubmit(e, true)}
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

