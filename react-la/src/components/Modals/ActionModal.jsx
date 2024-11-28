import {Button, Modal, Table} from "@mantine/core";
import PropTypes from "prop-types";
import CreateModal from "./CreateModal.jsx";
import EditableAvatar from "../EditableAvatar.jsx";


function ActionModal({
                         opened,
                         setOpened,
                         message,
                         confirmModalOpened,
                         setConfirmModalOpened,
                         confirmDelete,
                         readMoreModalOpened,
                         setReadMoreModalOpened,
                         selectedMember,
                         editModalOpened,
                         setEditModalOpened,
                         memberToEdit,
                         setMemberToEdit,
                         handleEditFormSubmit,
                         errors,
                         handleProfilePictureUpload,
                     }) {
    return (
        <>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)} // ปิด Modal
                title={<span style={{color: 'red'}}>Alert</span>}
                centered
            >
                {message}
            </Modal>
            <Modal
                opened={confirmModalOpened}
                onClose={() => setConfirmModalOpened(false)}
                title={<span style={{color: 'red'}}>Confirm Delete</span>}
                centered
            >
                <p>Are you sure you want to delete this member?</p>
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button color="red" onClick={confirmDelete}>Confirm</Button> &nbsp;
                    <Button onClick={() => setConfirmModalOpened(false)}>Cancel</Button>
                </div>
            </Modal>
            <Modal opened={readMoreModalOpened}
                   onClose={() => setReadMoreModalOpened(false)}
                   title="Member Information"
                   centered
            >
                {selectedMember && (

                    <>
                        <EditableAvatar
                            selectedMember={selectedMember}
                            onUpload={(file) => handleProfilePictureUpload(file, selectedMember.id)}
                        />
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
                    </>
                )}

            </Modal>

            <CreateModal
                opened={editModalOpened}
                onClose={() => setEditModalOpened(false)}
                onSubmit={handleEditFormSubmit}
                formData={memberToEdit || {}}
                setFormData={setMemberToEdit}
                errors={errors}
                isEditing={true}
            />
        </>)
}


ActionModal.propTypes = {
    opened: PropTypes.bool.isRequired,
    setOpened: PropTypes.func.isRequired,
    message: PropTypes.string,
    confirmModalOpened: PropTypes.bool.isRequired,
    setConfirmModalOpened: PropTypes.func.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    readMoreModalOpened: PropTypes.bool.isRequired,
    setReadMoreModalOpened: PropTypes.func.isRequired,
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
    }),
    editModalOpened: PropTypes.bool.isRequired,
    setEditModalOpened: PropTypes.func.isRequired,
    memberToEdit: PropTypes.shape({
        id: PropTypes.number.isRequired,
        member_name: PropTypes.string.isRequired,
        membership_type: PropTypes.string.isRequired,
        age: PropTypes.number.isRequired,
        gender: PropTypes.string.isRequired,
        phone_number: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        address: PropTypes.string,
        notes: PropTypes.string,
        expiration_date: PropTypes.string,
    }),
    setMemberToEdit: PropTypes.func.isRequired,
    handleEditFormSubmit: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,

};

export default ActionModal;
