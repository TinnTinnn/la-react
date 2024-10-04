import {Link, Outlet, useNavigate} from "react-router-dom";
import {useContext} from "react";
import {AppContext} from "../Context/AppContext.jsx";
import { Anchor, Button } from '@mantine/core';


export default function Layout() {
    const {user, token, setUser, setToken} = useContext(AppContext);
    const navigate = useNavigate()

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
                    <Link to="/create" style={{ textDecoration: 'none' , color: 'inherit' }}>
                        New Member
                    </Link>
                    <form onSubmit={handleLogout}>
                        <Button type="button" onClick={handleLogout} variant="filled" color="#3ABEF9">Log out</Button>
                    </form>
                </div>) : (<div className="nav-right">
                    <Link to="/register" style={{ textDecoration: 'none' , color: 'inherit' }} >
                        Register
                    </Link>
                    <Link to="/login" style={{ textDecoration: 'none' , color: 'inherit' }}>
                        Login
                    </Link>
                </div>)}
            </nav>
        </header>

        <main>
            <Outlet/>
        </main>
    </>)
}