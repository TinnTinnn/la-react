import {useEffect, useState} from "react";


export default function Home() {
    const [members, setMembers] = useState([]);
    async function getMembers() {
        const res = await fetch('/api/members')
        const data = await res.json();

        if (res.ok) {
            setMembers(data)
        }
    }

    useEffect(() => {
        getMembers();
    }, []);


    return (
        <>
            <h1 className="">Latest Members</h1>

            {members.length > 0 ? members.map(members => (
                <div key={members.id}>
                    <div>
                        <div>
                            <h2>{members.user_id}</h2>
                            <small>Created by {members.user.name} on{""}
                                {new Date(members.created_at).toLocaleTimeString()}
                            </small>
                        </div>
                    </div>
                </div>
            )) : <p>There are no members</p>}
        </>
    );
}