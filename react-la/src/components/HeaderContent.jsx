import {useContext, useEffect, useState} from "react";
import {AppContext} from "../Context/AppContext.jsx";
import {useNavigate} from "react-router-dom";
import {useDisclosure} from "@mantine/hooks";
import {Anchor, Burger, Button, Indicator, Menu, Modal, Table,} from "@mantine/core";
import Login from "../Pages/Auth/Login.jsx";
import Register from "../Pages/Auth/Register.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import EditableAvatar from "./EditableAvatar.jsx";
import {faBell} from "@fortawesome/free-regular-svg-icons/faBell";
import RequestResetForm from "../Pages/Auth/RequestResetForm.jsx";
import {notifications} from "@mantine/notifications";
import axios from "axios";


const HeaderContent = ({opened, toggle,}) => {
    const {user, token, setUser, setToken} = useContext(AppContext);
    const navigate = useNavigate()

    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    // จัดการส่วน Notifications
    const [forNotifications, setForNotifications] = useState([]);



    // ตัวแปรสำหรับจัดการ indicator เพื่อเปลี่ยนสถานะ อ่านหรือยัง
    const markAsRead = (notificationId) => {
        // เรียก API หรือทำการเปลี่ยนข้อมูลใน database คอลัมน์ read_status เป็น 1
        axios.put(`${API_URL}/api/notifications/${notificationId}`, {read_status: 1},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            .then(response => {
                console.log('Notification marked as read:', response.data);

                // เพื่อให้อัพเดท state ทันทีที่ API สำเร็จ
                setForNotifications(prevNotifications =>
                    prevNotifications.map(notif =>
                    notif.id === notificationId ? {...notif, read_status: 1} : notif
                    )
                );

            })
            .catch(error => {
                console.error('Error marking notification as read:', error);
            });
    };

    const showNotification = (title, message) => {
        const userName = user?.name || 'User';
        notifications.show({
            title: `User, ${userName}`,
            message,
            autoClose: 5000,
            position: 'top-right',
            radius: "lg",
            styles: () => ({
                root: {
                    top: '40px', // ปรับตำแหน่งขึ้นจากขอบบน
                    // right: '20px',
                    // zIndex: 9999, //
                },
            }),
        });
    };


    // จัดการส่วน Modal แสดงข้อมล User ที่ล็อคอิน
    const [accountModalOpened, setAccountModalOpened] = useState(false);

    // จัดการเกี่ยวกับ Modals สำหรับ Register, Login, และ Success
    const [openedRegister, {open: openRegister, close: closeRegister}] = useDisclosure(false);
    const [openedLogin, {open: openLogin, close: closeLogin}] = useDisclosure(false);
    const [openedSuccess, {open: openSuccess, close: closeSuccess}] = useDisclosure(false);
    const [openedReset, {open: openReset, close: closeReset}] = useDisclosure(false);

    // เพิ่ม state ส่วนนี้เพื่อ Toggle ระหว่าง Login และ Register
    const [isLogin, setIsLogin] = useState(true);



    // ฟังค์ชั่น toggle ระหว่าง Login และ Register
    const toggleForm = () => {
        setIsLogin((prev) => !prev)
    };

// ฟังก์ชันเปิด Modal สำหรับ Register และตั้งค่า isLogin เป็น false
    const openRegisterModal = () => {
        setIsLogin(false);  // เปิดฟอร์ม Register
        openRegister();     // เปิด Modal
    }

    // ฟังค์ชั่นเปิด Modal จาก Login ไป Reset Password Request
    const openResetModalFromLogin = () => {
        closeLogin();
        openReset();
    }

// ฟังก์ชันเปิด Modal สำหรับ Login และตั้งค่า isLogin เป็น true
    const openLoginModal = () => {
        setIsLogin(true);   // เปิดฟอร์ม Login
        openLogin();        // เปิด Modal
    }


    // UseEffect สำหรับ จัดการ User ที่ Session หมดอายุ แล้ว เปลี่ยเป็นโดน Log out ทันที โดยไม่ต้อง Refresh
    useEffect (() => {
        if (!token) {
            setUser(null); // เพื่อความแน่ใจว่า User state โดน รีเซ็ท หาก Token เป็นค่า Null
        }
    }, [token])


    // ฟังค์ชั่น สำหรับ Fetch API ของ Notifications
    useEffect(() => {
        if (!token) {
            console.log("User is logged out, cannot fetch notifications.");
            return;
        }
        const fetchNotifications = async () => {
            try {
                const response = await fetch(`${API_URL}/api/notifications`, {
                    headers: {Authorization: `Bearer ${token}`},
                });
                const data = await response.json();


                if (Array.isArray(data)) {
                    setForNotifications(prevNotifications => [
                        ...(Array.isArray(prevNotifications) ? prevNotifications : []),
                        ...data
                    ]);
                } else {
                    console.error("Invalid data format", data);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, [token]);


    async function handleLogout(e) {
        e.preventDefault();

        const res = await fetch(`${API_URL}/api/logout`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (res.ok) {
            let data = null;
            try {
                data = await res.json();
            } catch (err) {
                console.error("Error parsing JSON:", err)
            }

            console.log(data);

            setUser(null)
            setToken(null)
            localStorage.removeItem("token")
            navigate('/')
        } else {
            console.error("Logout failed:", res.statusText)
        }
    }

    // upload รูปโปรไฟล์ของ User
    const handleProfilePictureUpload = (file) => {
        const formData = new FormData();
        formData.append("profile_picture", file);
        formData.append("user_id", user.id); // ใช้ 'user_id' จาก COntext หรือ state

        fetch(`${API_URL}/api/upload-profile-picture`, {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json();
            })
            .then((data) => {
                setUser((prevUser) => ({
                    ...prevUser,
                    profile_picture: data.profile_picture,
                }));
                notifications.show({
                    title: "Success",
                    message: "Profile picture updated successfully.",
                    color: "green",
                });
            })
            .catch(() => {
                notifications.show({
                    title: "Error",
                    message: "Failed to update profile picture. Please try again.",
                    color: "red",
                });
            });
    };


    return (
        <>
            <nav className="nav-container">
                <Burger
                    opened={opened}
                    onClick={toggle}
                    className="burger-hidden"
                    size="sm"
                />

                {user ?
                    (<div className="nav-right" style={{display: "flex", justifyContent: "flex-end"}}>
                        {/*ส่วนแสดงชื่อ User ที่ล็อคอิน พร้อม Menu ต่างๆ */}
                        <div>Welcome back&nbsp;&nbsp;&nbsp;
                            <Menu trigger="hover" openDelay={100} closeDelay={400} shadow="md">
                                <Menu.Target>
                                    <Anchor
                                        variant="gradient"
                                        gradient={{from: 'purple', to: 'orange'}}
                                        fw={500}
                                        fz="lg"
                                        style={{cursor: "pointer"}}
                                    >
                                        {user.name}
                                    </Anchor>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Item
                                        onClick={() => setAccountModalOpened(true)}
                                    >
                                        My Account
                                    </Menu.Item>
                                    <Menu.Item
                                    >
                                        My Member
                                    </Menu.Item>
                                    <Menu.Divider>
                                        <Menu.Item
                                            onClick={handleLogout}
                                        >
                                            <FontAwesomeIcon style={{marginRight: '8px'}} icon={faRightFromBracket}/>
                                            Log out
                                        </Menu.Item>
                                    </Menu.Divider>
                                </Menu.Dropdown>
                            </Menu>
                            {/*&nbsp;&nbsp;*/}


                            {/*  For Notification   */}
                            <Anchor
                                variant="gradient"
                                style={{cursor: "pointer"}}
                                onClick={() => {
                                    // แสดง Notification เมื่อคลิกที่ไอคอน Bell
                                    forNotifications.slice(0, 3).forEach((notif) => {
                                        // เมื่อคลิกจะส่งการแจ้งเตือนและอัพเดท read_status ใน database
                                        showNotification(notif.title, notif.message);
                                        markAsRead(notif.id); //
                                    });
                                }}
                            >
                                <Indicator
                                    inline
                                    processing={forNotifications.some(notif => notif.read_status === 0)}
                                    disabled={forNotifications.every(notif => notif.read_status === 1)}
                                    color="red"
                                    size={9}
                                    offset={0}
                                    position="top-end"
                                >
                                    <FontAwesomeIcon style={{marginLeft: '12px'}} icon={faBell}/>
                                </Indicator>
                            </Anchor>
                        </div>

                    </div>) : (<div className="nav-right">
                        {/*ส่วนสำหรับปุ่ม Register และ Login ตอนที่ยังไม่ได้ Login หรือ Register*/}
                        <Button variant="filled" color="teal" onClick={openRegisterModal}>
                            Register
                        </Button>
                        <Button variant="filled" color="indigo" onClick={openLoginModal}>
                            Login
                        </Button>
                    </div>)}
            </nav>

            {/*Modal สำหรับ Toggle ระหว่าง Register และ Login */}
            <Modal opened={openedRegister || openedLogin}
                   onClose={() => {
                       closeRegister();
                       closeLogin();
                   }}
                   title={isLogin ? "Login" : "Register"} centered>
                {isLogin ? (
                    <Login
                        closeModal={closeLogin}
                        toggleForm={toggleForm}
                        openResetModal={openResetModalFromLogin}
                    />
                ) : (
                    <Register closeModal={closeRegister} openSuccessModal={openSuccess} toggleForm={toggleForm}/>
                )}
            </Modal>

            <Modal
                opened={openedReset}
                onClose={closeReset}
                title="Reset Password"
                centered
            >
                <RequestResetForm closeModal={closeReset}/>
            </Modal>


            {/*Modal สำหรับ Success*/}
            <Modal opened={openedSuccess} onClose={closeSuccess} title="Registration Successful" centered>
                <p>Your registration was successful!</p>
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button onClick={closeSuccess}>Close</Button>
                </div>
            </Modal>

            {/*Modal สำหรับ User ที่ Login เพื่อดูและจัดการ Account ตัวเอง*/}
            <Modal
                opened={accountModalOpened}
                onClose={() => setAccountModalOpened(false)}
                title="My Account"
                centered
            >
                {user && (
                    <>
                        <EditableAvatar
                            selectedMember={user}
                            onUpload={handleProfilePictureUpload}
                            isUser={true}
                        />
                        <Table striped highlightOnHover withTableBorder>
                            <Table.Tbody>
                                <Table.Tr>
                                    <Table.Td><strong>Name:</strong></Table.Td>
                                    <Table.Td>{user.name}</Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td><strong>Email:</strong></Table.Td>
                                    <Table.Td>{user.email}</Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td><strong>Joined At:</strong></Table.Td>
                                    <Table.Td>{user.created_at}</Table.Td>
                                </Table.Tr>
                            </Table.Tbody>
                        </Table>
                    </>
                )}
            </Modal>
        </>)
}

HeaderContent.propTypes = {
    opened: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
}
export default HeaderContent;
