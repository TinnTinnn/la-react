import {Link, Outlet, useNavigate} from "react-router-dom";
import {useContext} from "react";
import {AppContext} from "../Context/AppContext.jsx";
import {Anchor, Button, Modal } from '@mantine/core';
import Register from "./Auth/Register.jsx";
import Login from "./Auth/Login.jsx";
import { useDisclosure } from '@mantine/hooks';



export default function Layout() {
    const {user, token, setUser, setToken} = useContext(AppContext);
    const navigate = useNavigate()

    const [openedRegister, {open: openRegister, close: closeRegister }] = useDisclosure(false);
    const [openedLogin, { open: openLogin, close: closeLogin }] = useDisclosure(false);
    const [openedSuccess, { open: openSuccess, close: closeSuccess }] = useDisclosure(false);

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

    return (<>
        <header>
            <nav className="nav-container">
                <Link to="/" style={{ textDecoration: 'none' , color: 'inherit' }}>
                    Home
                </Link>

                {user ? (<div className="nav-right">
                    <p>Welcome back&nbsp;
                        <Anchor
                            variant="gradient"
                            gradient={{ from: 'purple', to: 'orange' }}
                            fw={500}
                            fz="lg"
                        >
                            {user.name}
                        </Anchor>
                    </p>
                    {/*<Link to="/create" style={{ textDecoration: 'none' , color: 'inherit' }}>*/}
                    {/*    New Member*/}
                    {/*</Link>*/}
                    <form onSubmit={handleLogout}>
                        <Button type="button" onClick={handleLogout} variant="filled" color="#3ABEF9">Log out</Button>
                    </form>
                </div>) : (<div className="nav-right">
                    <Button variant="filled" color="teal" onClick={openRegister}>
                        Register
                    </Button>
                    <Button variant="filled" coclor="indigo" onClick={openLogin}>
                        Login
                    </Button>
                </div>)}
            </nav>
        </header>

        <main>
            <Outlet/>
        </main>
        <Modal opened={openedRegister} onClose={closeRegister} title="Register" centered>
            <Register openSuccessModal={openSuccess} closeModal={closeRegister} />
        </Modal>
        <Modal opened={openedLogin} onClose={closeLogin} title="Login" centered>
            <Login closeModal={closeLogin} />
        </Modal>
        <Modal opened={openedSuccess} onClose={closeSuccess} title="Registration Successful" centered>
            <p>Your registration was successful!</p>
            <Button onClick={closeSuccess}>Close</Button>
        </Modal>
    </>)
}