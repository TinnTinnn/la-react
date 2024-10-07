import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Table, Button} from '@mantine/core';


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
            <h1>Latest Members</h1>
            {members.length > 0 ? (
                <Table striped highlightOnHover withTableBorder  className="text-center">
                    <Table.Tr>
                        <Table.Th>ID</Table.Th>
                        <Table.Th>User ID</Table.Th>
                        <Table.Th>Member Name</Table.Th>
                        <Table.Th>Member Type</Table.Th>
                        <Table.Th>Created By</Table.Th>
                        <Table.Th>Created At</Table.Th>
                        <Table.Th>Email</Table.Th>
                        <Table.Th>Action</Table.Th>
                    </Table.Tr>
                    <Table.Tbody>
                        {members.map((member) =>
                            <Table.Tr key={member.id}>
                                <Table.Td>{member.id}</Table.Td>
                                <Table.Td>{member.user_id}</Table.Td>
                                <Table.Td>{member.member_name}</Table.Td>
                                <Table.Td>{member.membership_type}</Table.Td>
                                <Table.Td>{member.user.name}</Table.Td>
                                <Table.Td>
                                    {new Date(member.created_at).toLocaleTimeString()} <br />
                                    {new Date(member.created_at).toLocaleDateString()}
                                </Table.Td>
                                <Table.Td>{member.user.email}</Table.Td>
                                <Table.Td>
                                    <Button variant="filled" color="indigo">Edit</Button>&nbsp;
                                    <Button variant="filled" color="red">Del</Button>
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            ) : (
                <p className="text-center">There are no members</p>
            )}
        </>
    );
}

