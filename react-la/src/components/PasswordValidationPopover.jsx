import {useEffect, useState} from "react";
import { Box, List, ThemeIcon, Text } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

export default function PasswordValidationPopover({password}) {
    const [validations, setValidations] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });

    useEffect(() => {
        setValidations({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        })
    }, [password]);

    return (
        <Box mt="xs" mb="md" p="xs" style={{ border: '1px solid #e9ecef', borderRadius: '4px' }}>
            <Text fw={600} mb={8}>Password must contain:</Text>
            <List spacing="xs" size="sm">
                <List.Item 
                    icon={
                        <ThemeIcon color={validations.length ? 'green' : 'red'} size={22} radius="xl">
                            {validations.length ? <IconCheck size={14} /> : <IconX size={14} />}
                        </ThemeIcon>
                    }
                >
                    <Text c={validations.length ? 'green' : 'red'}>At least 8 characters</Text>
                </List.Item>
                <List.Item 
                    icon={
                        <ThemeIcon color={validations.uppercase ? 'green' : 'red'} size={22} radius="xl">
                            {validations.uppercase ? <IconCheck size={14} /> : <IconX size={14} />}
                        </ThemeIcon>
                    }
                >
                    <Text c={validations.uppercase ? 'green' : 'red'}>1 uppercase letter</Text>
                </List.Item>
                <List.Item 
                    icon={
                        <ThemeIcon color={validations.lowercase ? 'green' : 'red'} size={22} radius="xl">
                            {validations.lowercase ? <IconCheck size={14} /> : <IconX size={14} />}
                        </ThemeIcon>
                    }
                >
                    <Text c={validations.lowercase ? 'green' : 'red'}>1 lowercase letter</Text>
                </List.Item>
                <List.Item 
                    icon={
                        <ThemeIcon color={validations.number ? 'green' : 'red'} size={22} radius="xl">
                            {validations.number ? <IconCheck size={14} /> : <IconX size={14} />}
                        </ThemeIcon>
                    }
                >
                    <Text c={validations.number ? 'green' : 'red'}>1 number</Text>
                </List.Item>
                <List.Item 
                    icon={
                        <ThemeIcon color={validations.special ? 'green' : 'red'} size={22} radius="xl">
                            {validations.special ? <IconCheck size={14} /> : <IconX size={14} />}
                        </ThemeIcon>
                    }
                >
                    <Text c={validations.special ? 'green' : 'red'}>1 special character</Text>
                </List.Item>
            </List>
        </Box>
    )
}