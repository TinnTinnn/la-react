import {Button, FileButton, Group, Modal, NativeSelect, NumberInput, Space, Textarea, TextInput, } from "@mantine/core";

import {DatePickerInput} from "@mantine/dates";
import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons";




function CreateModal({ opened, onClose, onSubmit, formData, setFormData, errors, isEditing = false, handleUploadImg }) {

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={isEditing ? "Edit Member" : "Create New Member"}
            centered
        >
            <form onSubmit={onSubmit} className="">
                <div>
                    <TextInput label="Member Name" placeholder="Name here"
                               value={formData.member_name || ""}
                               required={true}
                               onChange={(e) =>
                                   setFormData({...formData, member_name: e.target.value})}/>
                    {errors.member_name && errors.member_name.map((error, index) => (
                        <div key={index} style={{ color: 'red', fontSize: '12px', marginTop: '4px'}}>{error}</div>
                    ))}
                    <Space h="sm"/>
                </div>

                <Group position="apart" grow>
                    <div>
                        <NumberInput label="Age"
                                     placeholder="Age here"
                                     value={formData.age}
                                     onChange={(value) =>
                                         setFormData({...formData, age: value})}
                                     min={10}
                                     max={60}
                                     required={true}
                        />
                        {errors.age && <p className="error">{errors.age[0]}</p>}
                    </div>

                    <div>
                        <NativeSelect
                            label="Gender"
                            rightSection={<FontAwesomeIcon icon={faCaretDown}/>}
                            value={formData.gender}
                            onChange={(e) =>
                                setFormData({...formData, gender: e.target.value})}
                            data={[
                                {value: '', label: 'Select gender', disabled: true},
                                {value: 'Male', label: 'Male'},
                                {value: 'Female', label: 'Female'},
                                {value: 'Other', label: 'Other'},
                            ]}
                            placeholder="Select gender"
                            required={true}
                        />
                        {errors.gender && <p className="error">{errors.gender}</p>}
                    </div>
                </Group>

                <Space h="sm"/>

                <Group position="apart" grow>
                    <div>
                        <TextInput
                            label="Phone Number"
                            placeholder="Phone number here"
                            value={formData.phone_number}
                            onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                            required={true}
                        />
                        {errors.phone_number && errors.phone_number.map((error, index) => (
                            <div key={index} style={{ color: 'red', fontSize: '12px', marginTop: '4px'}}>{error}</div>
                        ))}
                    </div>

                    <div>
                        <TextInput
                            label="Email"
                            placeholder="Email here"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required={true}
                        />
                        {errors.email && errors.email.map((error, index) => (
                            <div key={index} style={{ color: 'red', fontSize: '12px', marginTop: '4px'}}>{error}</div>
                        ))}
                    </div>
                </Group>

                <Space h="sm"/>

                <Group position="apart" grow>
                    <div>
                        <NativeSelect
                            label="Membership Type"
                            rightSection={<FontAwesomeIcon icon={faCaretDown}/>}
                            value={formData.membership_type}
                            onChange={(e) => setFormData({...formData, membership_type: e.currentTarget.value})}
                            data={[
                                {value: '', label: 'Select type', disabled: true},
                                {value: 'Platinum', label: 'Platinum'},
                                {value: 'Gold', label: 'Gold'},
                                {value: 'Silver', label: 'Silver'},
                                {value: 'Bronze', label: 'Bronze'},
                            ]}
                            placeholder="Select membership type"
                            required={true}
                        />
                        {errors.membership_type && <p className="error">{errors.membership_type[0]}</p>}
                    </div>

                    <div>
                        <DatePickerInput
                            label="Pick expiration date"
                            placeholder="expiration date"
                            value={formData.expiration_date ? new Date(formData.expiration_date + 'T00:00:00') : null} // เพิ่ม 'T00:00:00'
                            required={true}
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
                    </div>
                </Group>

                <Space h="sm"/>

                <div>
                    <Textarea
                        label="Address"
                        placeholder="Address here"
                        value={formData.address || ""}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        required={false}
                    />
                    {errors.address && <p className="error">{errors.address[0]}</p>}
                    <Space h="sm"/>
                </div>

                <div>
                    <Textarea
                        label="Notes"
                        placeholder="Notes here"
                        value={formData.notes || ""}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        required={false} // ถ้าไม่ต้องการให้เป็นฟิลด์ที่จำเป็น
                    />
                    {errors.notes && <p className="error">{errors.notes[0]}</p>}
                    <Space h="sm"/>
                </div>

                <Group position="apart" grow>
                    <div style={{display: 'flex', justifyContent: 'flex-start', marginBottom: '10px'}}>
                        <FileButton
                            onChange={(file) => {
                                setFormData({...formData, profile_picture: file});
                                handleUploadImg(file);
                            }}
                            accept="image/*"
                        >
                        {(props) => <Button {...props}>Upload Picture</Button>}
                        </FileButton>
                    </div>

                    <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '10px'}}>
                        <Button rightSection type="submit" variant="filled" color="green">{isEditing ? 'Update' : 'Create'}</Button>
                    </div>
                </Group>
            </form>
        </Modal>
    )
}

CreateModal.propTypes = {
    opened: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired, // เพิ่มการตรวจสอบสำหรับ onSubmit
    formData: PropTypes.shape({ // ตรวจสอบว่า formData มีโครงสร้างอย่างไร
        member_name: PropTypes.string,
        age: PropTypes.number,
        gender: PropTypes.string,
        phone_number: PropTypes.string,
        email: PropTypes.string,
        membership_type: PropTypes.string,
        expiration_date: PropTypes.string,
        address: PropTypes.string,
        notes: PropTypes.string,
        profile_picture: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.instanceOf(File),
        ]),
    }).isRequired,
    setFormData: PropTypes.func.isRequired, // เพิ่มการตรวจสอบสำหรับ setFormData
    errors: PropTypes.shape({ // ตรวจสอบว่า errors มีโครงสร้างอย่างไร
        member_name: PropTypes.arrayOf(PropTypes.string),
        age: PropTypes.arrayOf(PropTypes.number),
        gender: PropTypes.arrayOf(PropTypes.string),
        phone_number: PropTypes.arrayOf(PropTypes.string),
        email: PropTypes.arrayOf(PropTypes.string),
        membership_type: PropTypes.arrayOf(PropTypes.string),
        expiration_date: PropTypes.arrayOf(PropTypes.string),
        address: PropTypes.arrayOf(PropTypes.string),
        notes: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    isEditing: PropTypes.bool,
    handleUploadImg: PropTypes.func,
};
export default CreateModal;