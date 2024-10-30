import {Button, FileInput, Group, Modal, NativeSelect, NumberInput, Space, Textarea, TextInput} from "@mantine/core";

import {DatePickerInput} from "@mantine/dates";
import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons";




function CreateModal({ opened, onClose, onSubmit, formData, setFormData, errors,  }) {



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
                               required={true}
                               onChange={(e) =>
                                   setFormData({...formData, member_name: e.target.value})}/>
                    {errors.member_name && <p className="error">{errors.member_name[0]}</p>}
                    <Space h="md"/>
                </div>

                <Group position="apart" grow>
                    <div>
                        <NumberInput label="Age"
                                     placeholder="Your member age here"
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

                <Space h="md"/>

                <Group position="apart" grow>
                    <div>
                        <TextInput
                            label="Phone Number"
                            placeholder="Your phone number here"
                            value={formData.phone_number}
                            onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                            required={true}
                        />
                        {errors.phone_number && <p className="error">{errors.phone_number[0]}</p>}
                    </div>

                    <div>
                        <TextInput
                            label="Email"
                            placeholder="Your email here"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required={true}
                        />
                        {errors.email && <p className="error">{errors.email[0]}</p>}
                    </div>
                </Group>

                <Space h="md"/>

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

                <Space h="md"/>

                <div>
                    <Textarea
                        label="Address"
                        placeholder="Your address here"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        required={false}
                    />
                    {errors.address && <p className="error">{errors.address[0]}</p>}
                    <Space h="md"/>
                </div>

                <div>
                    <Textarea
                        label="Notes"
                        placeholder="Your notes here"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        required={false} // ถ้าไม่ต้องการให้เป็นฟิลด์ที่จำเป็น
                    />
                    {errors.notes && <p className="error">{errors.notes[0]}</p>}
                    <Space h="md"/>
                </div>

                <Group position="apart" grow>
                    {/*<div>*/}
                    {/*    <FileInput*/}
                    {/*        lable="Profile Picture"*/}
                    {/*        placeholder="Select an image"*/}
                    {/*        accept="image/*"*/}
                    {/*        value={formData.profile_picture}*/}
                    {/*        onChange={(file) => setFormData({...formData, profile_picture: file })}*/}
                    {/*    />*/}
                    {/*    {errors.profile_picture && <p className="error">{errors.profile_picture[0]}</p>}*/}
                    {/*</div>*/}

                    <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px',}}>
                        <Button rightSection type="submit" variant="filled" color="green">Create</Button>
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
        member_name: PropTypes.string.isRequired,
        age: PropTypes.number,
        gender: PropTypes.string,
        phone_number: PropTypes.string,
        email: PropTypes.string,
        membership_type: PropTypes.string,
        expiration_date: PropTypes.string,
        address: PropTypes.string,
        notes: PropTypes.string,
    }).isRequired,
    setFormData: PropTypes.func.isRequired, // เพิ่มการตรวจสอบสำหรับ setFormData
    errors: PropTypes.shape({ // ตรวจสอบว่า errors มีโครงสร้างอย่างไร
        member_name: PropTypes.arrayOf(PropTypes.string),
        age: PropTypes.arrayOf(PropTypes.string),
        gender: PropTypes.arrayOf(PropTypes.string),
        phone_number: PropTypes.arrayOf(PropTypes.string),
        email: PropTypes.arrayOf(PropTypes.string),
        membership_type: PropTypes.arrayOf(PropTypes.string),
        expiration_date: PropTypes.arrayOf(PropTypes.string),
        address: PropTypes.arrayOf(PropTypes.string),
        notes: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    membershipType: PropTypes.string, // เพิ่มการตรวจสอบสำหรับ membershipType
    setMembershipType: PropTypes.func.isRequired, // เพิ่มการตรวจสอบสำหรับ setMembershipType
};
export default CreateModal;