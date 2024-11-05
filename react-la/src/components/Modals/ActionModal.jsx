import {Button, Modal,} from "@mantine/core";
import PropTypes from "prop-types";
import CreateModal from "./CreateModal.jsx";


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
                {selectedMember && (<div>
                    <p><strong>ID:</strong> {selectedMember.id}</p>
                    <p><strong>Member Name:</strong> {selectedMember.member_name}</p>
                    <p><strong>Age:</strong> {selectedMember.age}</p>
                    <p><strong>Gender:</strong> {selectedMember.gender}</p>
                    <p><strong>Phone number:</strong> {selectedMember.phone_number}</p>
                    <p><strong>Membership Type:</strong> {selectedMember.membership_type}</p>
                    <p><strong>Email:</strong> {selectedMember.email}</p>
                    <p><strong>Address:</strong> {selectedMember.address}</p>
                    <p><strong>Notes:</strong> {selectedMember.notes}</p>
                    <p><strong>Created By:</strong> {selectedMember.user.name}</p>
                    <p><strong>Created At:</strong> {new Date(selectedMember.created_at).toLocaleString()}</p>
                    <p><strong>Expiration Date:</strong> {selectedMember.expiration_date}</p>
                </div>)}
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