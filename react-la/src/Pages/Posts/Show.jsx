import {Link, useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../Context/AppContext.jsx";

export default function Show() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {user, token} = useContext(AppContext)

    const [member, setMember] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    async function getMembers() {
        const res = await fetch(`${API_URL}/api/members/${id}`);
        const data = await res.json();

        if (res.ok) {
            setMember(data.member)
        }
    }

    async function handleDelete(e) {
        e.preventDefault();

        if (user && user.id === member.user_id) {
            const res = await fetch (`${API_URL}/api/members/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })


            if (res.ok) {
                if (res.status === 204) {
                    console.log('Member deleted successfully.');
                    navigate("/");
                } else {
                    const data = await res.json();
                    console.log(data);
                    navigate("/");
                }
            } else {
                const errorData = await res.json();
                console.log(errorData)
            }
        }
    }

    useEffect(() => {
        getMembers();
    }, []);

    return (
        <>
            {member  ? (
                <div key={member.id} className="border">
                    <div>
                        <div>
                            <h2>{member.user_id}</h2>
                            <small>Created by {member.user.name} on{" "}
                                {new Date(member.created_at).toLocaleTimeString()}
                            </small>
                        </div>
                    </div>
                    <p>{member.body}</p>
                    {user && user.id === member.user_id  && <div>
                        <Link to={`/members/update/${member.id}`} className="">Update</Link>

                        <form onSubmit={handleDelete}>
                            <button className="">
                                Delete
                            </button>
                        </form>
                    </div>}
                </div>
            ):( <p>Member not found!</p>)}
        </>
    )
}