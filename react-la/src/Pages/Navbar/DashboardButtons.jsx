import {Button, Stack} from "@mantine/core";
import {useLocation, useNavigate} from "react-router-dom";
import PropTypes from "prop-types";

function  DashboardButtons ({ toggle } ) {
    const location = useLocation();
    const navigate = useNavigate();

    const getButtonClassName = (path) => {
        const isSelected = location.pathname === path;
        return isSelected ? 'button-selected' : 'button-default';
    };


    const handleNavigate = (path) => {
        navigate(path);
        toggle();
    };
    return (
        <Stack
            align="stretch"
            justify="center"
            gap={0}
        >
            <Button
                onClick={() => handleNavigate("/overview")}
                variant="subtle"
                radius="xs"
                fullWidth
                className={getButtonClassName("/overview")}
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
                onClick={() => handleNavigate("/membermanagement")}
                variant="subtle"
                radius="xs"
                fullWidth
                className={getButtonClassName("/membermanagement")}
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
                onClick={() => handleNavigate("/analytics")}
                variant="subtle"
                radius="xs"
                fullWidth
                className={getButtonClassName("/analytics")}
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
                onClick={() => handleNavigate("/saas")}
                variant="subtle"
                radius="xs"
                fullWidth
                className={getButtonClassName("/saas")}
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

DashboardButtons.propTypes = {
    toggle: PropTypes.func.isRequired,
};
export default  DashboardButtons