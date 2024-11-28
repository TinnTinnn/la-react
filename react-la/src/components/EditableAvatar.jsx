import {useState} from "react";
import {Avatar, Button, FileButton} from "@mantine/core";

function EditableAvatar({ selectedMember, onUpload }) {
    const [file, setFile] = useState(null);

    const handleFileChange = (uploadedFile) => {
        setFile(uploadedFile);
        onUpload(uploadedFile);
    };

    return (
        <div style={{textAlign: 'center', marginBottom: '20px'}}>
            <FileButton onChange={handleFileChange} accept="image/*">
                {(props) => (
                    <Avatar
                        {...props}
                        src={file ? URL.createObjectURL(file) : selectedMember.profile_picture}
                        alt={`${selectedMember.member_name}'s Profile Picture`}
                        size={120}
                        radius="xl"
                        styles={{root: {margin: 'auto'}}}
                    />
                )}
            </FileButton>
            {file && (
                <Button
                    size="xs"
                    color="blue"
                    mt="sm"
                    onClick={() => handleFileChange(null)}
                >
                    Clear Selection
                </Button>
            )}
        </div>
    )
}
export default EditableAvatar;