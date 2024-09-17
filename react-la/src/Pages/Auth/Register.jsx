export default function Register() {
    return (
        <>
            <h1 className="">Register a new account</h1>

            <form className="">
                <div>
                    <input type="text" placeholder="Name" />
                </div>

                <div>
                    <input type="text" placeholder="Email" />
                </div>

                <div>
                    <input type="password" placeholder="Password" />
                </div>

                <div>
                    <input type="password" placeholder="Confirm Password" />
                </div>

                <button className="">Register</button>
            </form>
        </>
    );
}