import {Card, Group, Text} from "@mantine/core";
import PropTypes from "prop-types";


export default function MemberStatsCard({ totalMembers, newMembers }) {
    return (
        <Card shadow="md" padding="lg" radius="md" withBorder>
            <Group position="apart">
                <Text weight={700} size="lg">Total Members</Text>
            </Group>
            <Text size="xl" weight={600}>{totalMembers}</Text>
            <Text color="dimmed" size="sm">Current members in the system</Text>

            <Group position="apart" mt="md">
                <Text weight={700} size="lg">New Members this Month</Text>
            </Group>
            <Text size="xl" weight={600}>{newMembers}</Text>
            <Text color="dimmed" size="sm">Registered this month</Text>
        </Card>
    )
}

MemberStatsCard.propTypes = {
     totalMembers: PropTypes.number,
     newMembers: PropTypes.number,
}