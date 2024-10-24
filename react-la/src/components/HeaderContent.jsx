import {useContext, useState} from "react";
import {AppContext} from "../Context/AppContext.jsx";
import {useNavigate} from "react-router-dom";
import {useDisclosure} from "@mantine/hooks";
import {Anchor, Burger, Button, Menu, Modal,} from "@mantine/core";
import Login from "../Pages/Auth/Login.jsx";
import Register from "../Pages/Auth/Register.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";


const HeaderContent = ({opened, toggle}) => {
    const {user, token, setUser, setToken} = useContext(AppContext);
    const navigate = useNavigate()

    // จัดการเกี่ยวกับ Modals สำหรับ Register, Login, และ Success
    const [openedRegister, {open: openRegister, close: closeRegister}] = useDisclosure(false);
    const [openedLogin, {open: openLogin, close: closeLogin}] = useDisclosure(false);
    const [openedSuccess, {open: openSuccess, close: closeSuccess}] = useDisclosure(false);

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

// ฟังก์ชันเปิด Modal สำหรับ Login และตั้งค่า isLogin เป็น true
    const openLoginModal = () => {
        setIsLogin(true);   // เปิดฟอร์ม Login
        openLogin();        // เปิด Modal
    }

    async function handleLogout(e) {
        e.preventDefault();

        const res = await fetch("/api/logout", {
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
                        {/*ส่วนแสดงชื่อ User ที่พร้อมเข้า Menu ต่างๆ */}
                        <p>Welcome back&nbsp;&nbsp;&nbsp;
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
                                    <Menu.Item>My Account</Menu.Item>
                                    <Menu.Item>My Member</Menu.Item>
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
                        </p>
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
                    <Login closeModal={closeLogin} toggleForm={toggleForm}/>
                ) : (
                    <Register closeModal={closeRegister} openSuccessModal={openSuccess} toggleForm={toggleForm}/>
                )}
            </Modal>

            {/*Modal สำหรับ Success*/}
            <Modal opened={openedSuccess} onClose={closeSuccess} title="Registration Successful" centered>
                <p>Your registration was successful!</p>
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button onClick={closeSuccess}>Close</Button>
                </div>
            </Modal>
        </>)

}

HeaderContent.propTypes = {
    opened : PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
}
export default HeaderContent;
