import {Avatar, Button, Group, Stack, Text} from "@mantine/core";
import {useLocation, useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartLine, faChartPie, faChartSimple, faUserGear} from "@fortawesome/free-solid-svg-icons";
import {useContext} from "react";
import {AppContext} from "../../Context/AppContext.jsx";

function  DashboardButtons ({  toggle } ) {
    const { user } = useContext(AppContext)
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
            justify="space-between"
            gap={0}
            style={{ height: "100%"}}
        >
            <div>
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
                    <FontAwesomeIcon style={{ marginRight: '8px'}} icon={faChartLine} />
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
                    <FontAwesomeIcon style={{ marginRight: '8px'}} icon={faUserGear} />
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
                    <FontAwesomeIcon  style={{ marginRight: '10px'}} icon={faChartSimple} />
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
                    <FontAwesomeIcon style={{ marginRight: '10px'}} icon={faChartPie} />
                    SaaS
                </Button>
            </div>

            <Group
                position="left"
                spacing="sm"
                style={{
                    padding: "10px",
                    borderTop: "1px solid #e0e0e0",
                }}
            >
                <Avatar src={user?.profile_picture || null} alt={user?.name || "User"} radius="xl"/>
                <div>
                    <Text size="sm" weight={500}>
                        {user?.name || "Guest User"}
                    </Text>
                    <Text size="xs" color="dimmed">
                        {user?.email || "guest@exmaple.com"}
                    </Text>
                </div>
            </Group>
        </Stack>
    );
}

DashboardButtons.propTypes = {
    toggle: PropTypes.func.isRequired,
};
export default  DashboardButtons