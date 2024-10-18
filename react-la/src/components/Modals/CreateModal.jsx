import {Button, Modal, NativeSelect, Space, TextInput} from "@mantine/core";
import {IconChevronDown} from "@tabler/icons-react";
import {DatePickerInput} from "@mantine/dates";
import PropTypes from "prop-types";


function CreateModal({opened, onClose, onSubmit, formData, setFormData, errors,}) {


    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Create New Member"
            centered
        >
            <form onSubmit={onSubmit} className="">
                <div>
                    <TextInput label="Member Name" placeholder="Your member name here"
                               value={formData.member_name}
                               onChange={(e) =>
                                   setFormData({...formData, member_name: e.target.value})}/>
                    {errors.member_name && <p className="error">{errors.member_name[0]}</p>}
                    <Space h="md"/>
                </div>

                <div>
                    <NativeSelect
                        label="Membership Type"
                        rightSection={<IconChevronDown size={14} stroke={1.5}/>}
                        value={formData.membership_type}
                        onChange={(e) => setFormData({...formData, membership_type: e.currentTarget.value})}
                        data={[
                            {value: '', label: 'Select type', disabled: true},
                            {value: 'Platinum', label: 'Platinum'},
                            {value: 'Gold', label: 'Gold'},
                            {value: 'Silver', label: 'Silver'},
                            {value: 'Bronze', label: 'Bronze'},
                        ]}
                        placeholder="Select membership type" // แสดง placeholder
                    />
                    {errors.membership_type && <p className="error">{errors.membership_type[0]}</p>}
                    <Space h="md"/>
                </div>

                <div>
                    <DatePickerInput
                        label="Pick expiration date"
                        placeholder="expiration date"
                        value={formData.expiration_date ? new Date(formData.expiration_date + 'T00:00:00') : null} // เพิ่ม 'T00:00:00'
                        onChange={(date) => {
                            if (date) {
                                // ใช้ toLocaleDateString เพื่อจัดรูปแบบวันที่ตามเขตเวลาท้องถิ่น
                                const formattedDate =
                                    date.toLocaleDateString('en-CA'); // ใช้ 'en-CA' เพื่อให้ได้รูปแบบ YYYY-MM-DD ไม่แน่ใจว่าเพราะ Mantine หรือเปล่า ถ้าเปลี่ยนเป็นของประเทศอื่นจะแสดงเละไปเลย
                                setFormData({
                                    ...formData,
                                    expiration_date: formattedDate,
                                });
                            } else {
                                setFormData({
                                    ...formData,
                                    expiration_date: "",
                                });
                            }
                        }}
                    />
                    {errors.expiration_date && <p className="error">{errors.expiration_date[0]}</p>}
                    <Space h="md"/>
                </div>


                <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px',}}>
                    <Button rightSection type="submit" variant="filled" color="green">Create</Button>
                </div>
            </form>
        </Modal>
    )
}

CreateModal.propTypes = {
    opened: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    formData: PropTypes.shape({
        member_name: PropTypes.string.isRequired,
        membership_type: PropTypes.string.isRequired,
        expiration_date: PropTypes.string.isRequired,
    }).isRequired,
    setFormData: PropTypes.func.isRequired,
    errors: PropTypes.shape({
        member_name: PropTypes.arrayOf(PropTypes.string),
        membership_type: PropTypes.arrayOf(PropTypes.string),
        expiration_date: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    membershipType: PropTypes.string.isRequired,
    setMembershipType: PropTypes.func.isRequired,
};
export default CreateModal;