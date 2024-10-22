import {Button, Stack} from "@mantine/core";
import {useNavigate} from "react-router-dom";

function  DashboardButtons () {
    const navigate = useNavigate();
    return (
        <Stack
            align="stretch"
            justify="center"
            gap={0}
        >
            <Button
                onClick={() => navigate("/overview")}
                variant="subtle"
                radius="xs"
                fullWidth
                color="white"
                styles={{
                    label: {
                        width: '100%',
                        textAlign: 'left',
                        paddingLeft: '10px',
                    },
                }}
            >
                Overview
            </Button>
            <Button
                onClick={() => navigate("/membermanagement")}
                variant="subtle"
                radius="xs"
                fullWidth
                color="white"
                styles={{
                    label: {
                        width: '100%',
                        textAlign: 'left',
                        paddingLeft: '10px',
                    },
                }}
            >
                Member Management
            </Button>
            <Button
                onClick={() => navigate("/analytics")}
                variant="subtle"
                radius="xs"
                fullWidth
                color="white"
                styles={{
                    label: {
                        width: '100%',
                        textAlign: 'left',
                        paddingLeft: '10px',
                    },
                }}
            >
                Analytics
            </Button>
            <Button
                onClick={() => navigate("/saas")}
                variant="subtle"
                radius="xs"
                fullWidth
                color="white"
                styles={{
                    label: {
                        width: '100%',
                        textAlign: 'left',
                        paddingLeft: '10px',
                    },
                }}
            >
                SaaS
            </Button>
        </Stack>
    )
}

export default  DashboardButtons