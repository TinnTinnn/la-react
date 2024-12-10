import PropTypes  from "prop-types";
import {Card, Group, RingProgress, Stack, Table, Text} from "@mantine/core";
import '@mantine/charts/styles.css';


const MembershipExpirationChart = ({activeMembers, expiredMembers, totalMembers}) => {
    const activeMembersPercentage = (activeMembers / totalMembers) * 100;
    const expiredMemberPercentage = (expiredMembers / totalMembers) * 100;

    return (
        <Card shadow="md" padding="md" radius="md" withBorder>
            <Group posion="apart" justify="space-between">
                <Stack align="center" spacing="xs">
                    <Text weight={700} size="md" >Active</Text>
                    <RingProgress
                        size={80}
                        thickness={8}
                        roundCaps
                        sections={[{value: totalMembers > 0 ? Math.round(activeMembersPercentage) : 0, color: 'teal'}]}
                        label={<Text align="center" size="md">{totalMembers > 0 ? `${Math.round(activeMembersPercentage)}%` : '0%'}</Text>}
                    />
                </Stack>
                <Stack align="center" spacing="xs">
                    <Text weight={700} size="md">Expired</Text>

                    <RingProgress
                        size={80}
                        thickness={8}
                        roundCaps
                        sections={[{ value: totalMembers > 0 ? Math.round(expiredMemberPercentage) : 0, color: 'red' }]}
                        label={<Text align="center" size="md">{totalMembers > 0 ? `${Math.round(expiredMemberPercentage)}%` : '0%'}</Text>}
                    />
                </Stack>
            </Group>
            <Table mt="sm">
                <Table.Thead>
                <Table.Tr>
                    <Table.Th>Membership Type</Table.Th>
                    <Table.Th>Count</Table.Th>
                </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                <Table.Tr>
                    <Table.Td>Active Members</Table.Td>
                    <Table.Td>{activeMembers}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Td>Expired Members</Table.Td>
                    <Table.Td>{expiredMembers}</Table.Td>
                </Table.Tr>
                </Table.Tbody>
            </Table>
        </Card>
    )
}

MembershipExpirationChart.propTypes = {
    activeMembers: PropTypes.number.isRequired,
    expiredMembers: PropTypes.number.isRequired,
    totalMembers: PropTypes.number.isRequired,
};

export default MembershipExpirationChart;

