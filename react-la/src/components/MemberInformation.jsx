import { Table} from "@mantine/core";
import PropTypes from "prop-types";


function MemberInformation({selectedMember}) {
    if (!selectedMember) return null;

    return (
        <div>
            <Table striped highlightOnHover withTableBorder>
                <Table.Tbody>
                    <Table.Tr>
                        <Table.Td><strong>ID:</strong></Table.Td>
                        <Table.Td>{selectedMember.id}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Td><strong>Member Name:</strong></Table.Td>
                        <Table.Td>{selectedMember.member_name}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Td><strong>Age:</strong></Table.Td>
                        <Table.Td>{selectedMember.age}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Td><strong>Gender:</strong></Table.Td>
                        <Table.Td>{selectedMember.gender}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Td><strong>Phone Number:</strong></Table.Td>
                        <Table.Td>{selectedMember.phone_number}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Td><strong>Membership Type:</strong></Table.Td>
                        <Table.Td>{selectedMember.membership_type}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Td><strong>Email:</strong></Table.Td>
                        <Table.Td>{selectedMember.email}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Td><strong>Address:</strong></Table.Td>
                        <Table.Td>{selectedMember.address}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Td><strong>Notes:</strong></Table.Td>
                        <Table.Td>{selectedMember.notes}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Td><strong>Created By:</strong></Table.Td>
                        <Table.Td>{selectedMember.user.name}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Td><strong>Created At:</strong></Table.Td>
                        <Table.Td>{new Date(selectedMember.created_at).toLocaleString()}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Td><strong>Expiration Date:</strong></Table.Td>
                        <Table.Td>{selectedMember.expiration_date}</Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </Table>
        </div>
    )
}

MemberInformation.propTypes = {
    selectedMember: PropTypes.shape({
        id: PropTypes.number.isRequired,
        member_name: PropTypes.string.isRequired,
        membership_type: PropTypes.string.isRequired,
        user: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
        }),
        age: PropTypes.number.isRequired,
        gender: PropTypes.string.isRequired,
        phone_number: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        address: PropTypes.string,
        notes: PropTypes.string,
        created_at: PropTypes.string.isRequired,
        expiration_date: PropTypes.string,
    }).isRequired,
};

export default MemberInformation;