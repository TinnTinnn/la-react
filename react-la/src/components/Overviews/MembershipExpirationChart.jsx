import PropTypes  from "prop-types";
import {Card, Group, RingProgress, Stack, Text} from "@mantine/core";
import '@mantine/charts/styles.css';


const MembershipExpirationChart = ({activeMembers, expiredMembers, totalMembers}) => {
    const activeMembersPercentage = (activeMembers / totalMembers) * 100;
    const expiredMemberPercentage = (expiredMembers / totalMembers) * 100;

    return (
        <Card shadow="md" padding="lg" radius="md" withBorder>
            <Group posion="apart">
                <Stack align="center" spacing="xs">
                    <Text weight={700} size="lg">Active Members</Text>
                    <RingProgress
                        size={80}
                        thickness={8}
                        roundCaps
                        sections={[{value: totalMembers > 0 ? Math.round(activeMembersPercentage) : 0, color: 'teal'}]}
                        label={<Text align="center" size="md">{totalMembers > 0 ? `${Math.round(activeMembersPercentage)}%` : '0%'}</Text>}
                    />
                </Stack>
                <Stack align="center" spacing="xs">
                    <Text weight={700} size="lg">Expired Members</Text>

                    <RingProgress
                        size={80}
                        thickness={8}
                        roundCaps
                        sections={[{ value: totalMembers > 0 ? Math.round(expiredMemberPercentage) : 0, color: 'red' }]}
                        label={<Text align="center" size="md">{totalMembers > 0 ? `${Math.round(expiredMemberPercentage)}%` : '0%'}</Text>}
                    />
                </Stack>
            </Group>
        </Card>
    )
}

MembershipExpirationChart.propTypes = {
    activeMembers: PropTypes.number.isRequired,
    expiredMembers: PropTypes.number.isRequired,
    totalMembers: PropTypes.number.isRequired,
};

export default MembershipExpirationChart;

