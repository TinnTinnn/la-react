import {Card, Group, Text} from "@mantine/core";
import PropTypes from "prop-types";


export default function MemberStatsCard({ totalMembers, newMembers, todayMembers }) {
    return (
        <Card shadow="md" padding="md" radius="md" withBorder>
            <Group position="apart">
                <Text weight={800} size="md">Total Members</Text>
            </Group>
            <Text size="md" weight={500}>{totalMembers}</Text>
            <Text color="dimmed" size="sm">Current members in the system</Text>

            <Group position="apart" mt="md">
                <Text weight={800} size="md">New Members this Month</Text>
            </Group>
            <Text size="md" weight={500}>{newMembers}</Text>
            <Text color="dimmed" size="sm">Registered this month</Text>

            <Group position="apart" mt="md">
                <Text weight={800} size="md">New Members this Day</Text>
            </Group>
            <Text size="md" weight={500}>{todayMembers}</Text>
            <Text color="dimmed" size="sm">Registered this Day</Text>
        </Card>
    )
}

MemberStatsCard.propTypes = {
     totalMembers: PropTypes.number,
     newMembers: PropTypes.number,
    todayMembers: PropTypes.number,
}