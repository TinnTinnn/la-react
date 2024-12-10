import {Button, Menu, Table, Pagination, Avatar} from "@mantine/core";
import PropTypes from "prop-types";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCommentDots, faEllipsisVertical,  faUserMinus, faUserPen} from "@fortawesome/free-solid-svg-icons";


function MembersTable({members,totalMembers, itemsPerPage, activePage, onPageChange, handleReadMore, handleEdit, handleDelete,}) {
    const totalPages = Math.ceil(totalMembers / itemsPerPage); // คำนวณจำนวนหน้า

    return (
        <>
            {members.length > 0 ? (
                <Table striped highlightOnHover withTableBorder className="text-center">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>ID</Table.Th>
                            <Table.Th>Profile</Table.Th>
                            <Table.Th>Member Name</Table.Th>
                            <Table.Th>Member Type</Table.Th>
                            <Table.Th>Email</Table.Th>
                            <Table.Th>Created By</Table.Th>
                            <Table.Th>Action</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {members.map((member) =>
                            <Table.Tr key={member.id}>
                                <Table.Td>{member.id}</Table.Td>
                                <Table.Td>
                                    <Avatar
                                        src={member.profile_picture}
                                        alt={`${member.profile_picture}'s Profile Picture`}
                                        size={50}
                                        radius="xl"
                                        // styles={{root: {margin: 'auto'}}}
                                    />
                                </Table.Td>
                                <Table.Td>{member.member_name}</Table.Td>
                                <Table.Td>{member.membership_type}</Table.Td>
                                <Table.Td>{member.email}</Table.Td>
                                <Table.Td>{member.user.name}</Table.Td>
                                <Table.Td>
                                    <Menu shadow="md" width={200}>
                                        <Menu.Target>
                                            <Button variant="subtle" color="gray">
                                                <FontAwesomeIcon icon={faEllipsisVertical}/>
                                            </Button>
                                        </Menu.Target>

                                        <Menu.Dropdown>
                                            <Menu.Label>Application</Menu.Label>
                                            <Menu.Item
                                                onClick={() => handleReadMore(member)}>
                                                <FontAwesomeIcon style={{marginRight: '12px'}} icon={faCommentDots}/>
                                                Read more
                                            </Menu.Item>
                                            <Menu.Item
                                                onClick={() => handleEdit(member.id)}>
                                                <FontAwesomeIcon style={{marginRight: '8px'}} icon={faUserPen}/>
                                                Edit
                                            </Menu.Item>
                                            <Menu.Label>Danger Zone</Menu.Label>
                                            <Menu.Item
                                                color="red"
                                                onClick={() => handleDelete(member.id)}
                                            >
                                                <FontAwesomeIcon style={{marginRight: '12px'}} icon={faUserMinus}/>
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
                onChange={onPageChange}
                style={{marginTop: 20}}
            />

        </>
    )
}


MembersTable.propTypes = {
    members: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            member_name: PropTypes.string.isRequired,
            membership_type: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            profile_picture: PropTypes.string,
            user: PropTypes.shape({
                name: PropTypes.string.isRequired,
            }).isRequired,
        })
    ).isRequired,
    totalMembers: PropTypes.number.isRequired, // จำนวนสมาชิกทั้งหมด
    itemsPerPage: PropTypes.number.isRequired, // จำนวนสมาชิกต่อหน้า
    activePage: PropTypes.number.isRequired, // หน้าปัจจุบัน
    onPageChange: PropTypes.func.isRequired, // ฟังก์ชันสำหรับเปลี่ยนหน้า
    handleReadMore: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
};

export default MembersTable