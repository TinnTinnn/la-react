import {Link, Outlet, useNavigate} from "react-router-dom";
import {useContext} from "react";
import {AppContext} from "../Context/AppContext.jsx";

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
            <nav>
                <Link to="/">
                    Home
                </Link>

                {user ? (<div >
                    <p >Welcome back {user.name}</p>
                    <Link to="/create" >
                        New Member
                    </Link>
                    <form onSubmit={handleLogout}>
                        <button >Log out</button>
                    </form>
                </div>) : (<div >
                    <Link to="/register" >
                        Register
                    </Link>
                    <Link to="/login" >
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