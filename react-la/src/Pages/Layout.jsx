import {Link, Outlet, useNavigate} from "react-router-dom";
import {useContext} from "react";
import {AppContext} from "../Context/AppContext.jsx";

export default function Layout() {
    const {user, token, setUser, setToken} = useContext(AppContext);
    const navigate = useNavigate()

    async  function handleLogout(e) {
        e.preventDefault();

        const res = await fetch("/api/logout", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        const data = await res.json()
        console.log(data)

        if (res.ok) {
            setUser(null)
            setToken(null)
            localStorage.removeItem("token")
            navigate('/')
        }
    }

    return (<>
        <header>
            <nav>
                <Link to="/" className="">
                    Home
                </Link>

                {user ? (<div className="">
                    <p className="">Welcome back {user.name}</p>
                <form onSubmit={handleLogout}>
                    <button className="">Log out</button>
                </form>
                </div>) : (<div className="">
                    <Link to="/register" className="">
                        Register
                    </Link>
                    <Link to="/login" className="">
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