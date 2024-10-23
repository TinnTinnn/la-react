import {Button, Text} from "@mantine/core";

export default function Saas () {
    return(
        <>
        <Text style={{ marginTop: '80px' }}>SaaS page</Text>
            <Button
                sx={{
                    backgroundColor: 'red',
                    '&:hover': {
                        backgroundColor: 'darkred', // สีเมื่อ hover
                    },
                }}
            >
                Test Button
            </Button>
        </>
    )
}