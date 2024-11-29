import {useState} from "react";
import {Avatar, Button, FileButton, Group, Popover} from "@mantine/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faImagePortrait, faImages} from "@fortawesome/free-solid-svg-icons";

function EditableAvatar({selectedMember, onUpload}) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [opened, setOpened] = useState(false);

    const handleFileChange = (uploadedFile) => {
        setFile(uploadedFile);
        setPreview(URL.createObjectURL(uploadedFile)); // lร้าง URL สำหรับ preview
    };

    const handleConfirmUpload = () => {
        onUpload(file); // อัพโหลดไฟล์
        setOpened(false);
        setPreview(null); // ล้าง  preview
        setFile(null); // ล้างไฟล์
    }

    const handleCancel = () => {
        setPreview(null); // ยกเลิก preview
        setFile(null); // ล้างไฟล์
        setOpened(false);
    }

    return (
        <Popover
            opened={opened}
            onClose={() => setOpened(false)}
            position="bottom"
            withArrow
            shadow="md"
        >
            <Popover.Target>
                <div
                    style={{
                        textAlign: 'center',
                        marginBottom: '20px',
                        marginTop: '20px'
                    }}
                >
                    <div className="avatar-container">
                        <Avatar
                            onClick={() => setOpened((prev) => !prev)}
                            src={preview || selectedMember.profile_picture} // แสดง preview
                            alt={`${selectedMember.member_name}'s Profile Picture`}
                            size={120}
                            radius="xl"
                            styles={{root: {margin: 'auto', cursor: 'pointer'}}}
                        />
                    </div>
                </div>
            </Popover.Target>
            <Popover.Dropdown>
                {!preview ? (
                    <>
                        {/* ปุ่มดูรูปโปรไฟล์ */}
                        <Button
                            fullWidth
                            variant="subtle"
                            color="gray"
                            size="xs"
                            onClick={() =>
                                window.open(selectedMember.profile_picture, '_blank',
                                setOpened(false)
                                )}
                            style={{
                                marginBottom: '10px'
                            }}
                        >
                            <FontAwesomeIcon
                                style={{marginRight: '10px'}}
                                icon={faImagePortrait}
                            />
                            View Profile Picture
                        </Button>

                        {/*แสดงปุ่มให้เลือกไฟล์หากยังไม่มี preview*/}
                        <FileButton onChange={handleFileChange} accept="image/*">
                            {(props) => (
                                <Button
                                    {...props}
                                    fullWidth
                                    variant="subtle"
                                    color="gray"
                                    size="xs"
                                >
                                    <FontAwesomeIcon
                                        style={{marginRight: '10px'}}
                                        icon={faImages}
                                    />
                                    Change Profile Picture
                                </Button>
                            )}
                        </FileButton>
                    </>
                ) : (
                    // ถ้ามี preview แสดงปุ่มยืนยันหรือยกเลิก
                    <Group position="center" spacing="sm">
                        <Button
                            color="indigo"
                            size="xs"
                            onClick={() => {
                                handleConfirmUpload();
                                // setOpened(false);
                            }
                        }
                        >
                            Save
                        </Button>
                        <Button
                            color="grey"
                            size="xs"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                    </Group>
                )}
            </Popover.Dropdown>
        </Popover>
    )
}

export default EditableAvatar;