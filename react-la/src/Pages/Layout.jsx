import {Link, Outlet} from "react-router-dom";

export default function Layout() {
    return (
        <>
            <header>
                <nav>
                    <Link to="/" className="">
                        Home
                    </Link>
                    <div className="">
                        <Link to="/register" className="">
                            Register
                        </Link>
                        <Link to="/login" className="">
                            Login
                        </Link>
                    </div>

                </nav>
            </header>

            <main>
                <Outlet />
            </main>
        </>
    )
}