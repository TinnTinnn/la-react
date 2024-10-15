import {Button, Modal, NativeSelect, TextInput} from "@mantine/core";
import {DatePickerInput} from "@mantine/dates";


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
                         handleEditFormSubmit
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
                    <p><strong>Membership Type:</strong> {selectedMember.membership_type}</p>
                    <p><strong>Created By:</strong> {selectedMember.user.name}</p>
                    <p><strong>User ID:</strong> {selectedMember.user.id}</p>
                    <p><strong>Email:</strong> {selectedMember.user.email}</p>
                    <p><strong>Created At:</strong> {new Date(selectedMember.created_at).toLocaleString()}</p>
                </div>)}
            </Modal>

            <Modal
                opened={editModalOpened}
                onClose={() => setEditModalOpened(false)}
                title="Edit Member Information"
                centered
            >
                {memberToEdit && (<form onSubmit={(e) => handleEditFormSubmit(e)}>
                    <div>
                        <TextInput
                            label="Member Name"
                            value={memberToEdit.member_name}
                            onChange={(e) => setMemberToEdit({...memberToEdit, member_name: e.target.value})}
                        />
                    </div>

                    <div>
                        <NativeSelect
                            label="Membership Type"
                            value={memberToEdit.membership_type}
                            onChange={(e) => setMemberToEdit({...memberToEdit, membership_type: e.target.value})}
                            data={[{value: 'Platinum', label: 'Platinum'}, {
                                value: 'Gold', label: 'Gold'
                            }, {value: 'Silver', label: 'Silver'}, {value: 'Bronze', label: 'Bronze'},]}
                        />
                    </div>

                    <div>
                        <DatePickerInput
                            label="Pick expiration date"
                            value={memberToEdit.expiration_date ? new Date(memberToEdit.expiration_date) : null}
                            onChange={(date) => setMemberToEdit({
                                ...memberToEdit, expiration_date: date ? date.toISOString().split("T")[0] : ""
                            })}
                        />
                    </div>

                    <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '20px'}}>
                        <Button type="submit" variant="filled" color="green">Save Changes</Button>
                    </div>
                </form>)}
            </Modal>
        </>)
}

export default ActionModal;