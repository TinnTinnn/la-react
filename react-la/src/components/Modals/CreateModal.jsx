import {Button, Modal, NativeSelect, Space, TextInput} from "@mantine/core";
import {IconChevronDown} from "@tabler/icons-react";
import {DatePickerInput} from "@mantine/dates";
import PropTypes from "prop-types";


function CreateModal({opened, onClose, onSubmit, formData, setFormData, errors, membershipType, setMembershipType}) {
    const handleSelectChange = (e) => {
        setMembershipType(e.target.value);
        setFormData({...formData, membership_type: e.target.value});
    };

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
                        label="Membership Type"  // ตรงนี้จะเพิ่ม label ให้แสดง
                        rightSection={<IconChevronDown size={14} stroke={1.5}/>}
                        value={membershipType}
                        onChange={handleSelectChange}
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
                        label="Pick date"
                        placeholder="expiration date"
                        value={formData.expiration_date ? new Date(formData.expiration_date) : null}
                        onChange={(date) =>
                            setFormData({
                                ...formData,
                                expiration_date: date ? date.toISOString().split("T")[0] : ""
                            })}/>
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