import {Button, Menu, rem, Table, Pagination } from "@mantine/core";
import {IconMessage, IconSettings, IconTrash, IconDotsVertical} from "@tabler/icons-react";
import PropTypes from "prop-types";
import {useState} from "react";


function MembersTable({members, handleReadMore, handleEdit, handleDelete}) {

    // สำหรับการทำ Paginate
    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 5; // จำนวนสมาชิกต่อหน้า

    // คำนวณความยาวหน้า
    const totalMembers = members.length;
    const totalPages = Math.ceil(totalMembers / itemsPerPage);

    // คำนวณเริ่มต้นและสิ้นสุดของหน้า
    const startIndex = (activePage - 1) * itemsPerPage;
    const currentMembers = members.slice(startIndex, startIndex + itemsPerPage);

    return (
        <>
            {currentMembers.length > 0 ? (
                <Table striped highlightOnHover withTableBorder className="text-center">
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
                        { currentMembers.map((member) =>
                            <Table.Tr key={member.id}>
                                <Table.Td>{member.id}</Table.Td>
                                <Table.Td>{member.user_id}</Table.Td>
                                <Table.Td>{member.member_name}</Table.Td>
                                <Table.Td>{member.membership_type}</Table.Td>
                                <Table.Td>{member.user.name}</Table.Td>
                                <Table.Td>
                                    {new Date(member.created_at).toLocaleTimeString()} <br/>
                                    {new Date(member.created_at).toLocaleDateString()}
                                </Table.Td>
                                <Table.Td>{member.user.email}</Table.Td>
                                <Table.Td>
                                    <Menu shadow="md" width={200}>
                                        <Menu.Target>
                                            <Button variant="subtle" color="gray" compact>
                                                <IconDotsVertical size={16} />
                                            </Button>
                                        </Menu.Target>

                                        <Menu.Dropdown>
                                            <Menu.Label>Application</Menu.Label>
                                            <Menu.Item
                                                onClick={() => handleReadMore(member)}
                                                leftSection={<IconMessage style={{width: rem(14), height: rem(14)}}/>}>
                                                Read more
                                            </Menu.Item>
                                            <Menu.Item
                                                leftSection={<IconSettings style={{width: rem(14), height: rem(14)}}/>}
                                                onClick={() => handleEdit(member.id)}
                                            >
                                                Edit
                                            </Menu.Item>
                                            <Menu.Label>Danger Zone</Menu.Label>
                                            <Menu.Item
                                                color="red"
                                                leftSection={<IconTrash style={{width: rem(14), height: rem(14)}}/>}
                                                onClick={() => handleDelete(member.id)}
                                            >
                                                Delete Member
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            ) : (
                <p className="text-center">There are no members</p>
            )}

            <Pagination
                total={totalPages}
                page={activePage}
                onChange={setActivePage}
                style={{ marginTop: 20}}
            />

        </>
    )
}


MembersTable.propTypes = {
    members: PropTypes.arrayOf(
        PropTypes.shape({
            member_name: PropTypes.string.isRequired,
            membership_type: PropTypes.string.isRequired,
            expiration_date: PropTypes.string.isRequired,
        })
    ).isRequired,
    handleReadMore: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
};

export default MembersTable