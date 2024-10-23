import {Card, Text, Grid, Container, Group, Title, RingProgress, Paper} from '@mantine/core';

export default function Overview() {
    return (
        <Container size="xl" style={{marginTop: '80px'}}>
            <Title order={2} align="center" mb="lg">
                Dashboard Overview
            </Title>

            <Grid gutter="xl">
                <Grid.Col span={4}>
                    <Card shadow="md" padding="lg" radius="md" withBorder>
                        <Group position="apart">
                            <Text weight={700} size="lg">Users</Text>
                        </Group>
                        <Text size="xl" weight={600}>1,254</Text>
                        <Text color="dimmed" size="sm">Active users this month</Text>
                    </Card>
                </Grid.Col>

                <Grid.Col span={4}>
                    <Card shadow="md" padding="lg" radius="md" withBorder>
                        <Group position="apart">
                            <Text weight={700} size="lg">Revenue</Text>
                        </Group>
                        <Text size="xl" weight={600}>$12,345</Text>
                        <Text color="dimmed" size="sm">Total revenue this month</Text>
                    </Card>
                </Grid.Col>

                <Grid.Col span={4}>
                    <Card shadow="md" padding="lg" radius="md" withBorder>
                        <Group position="apart">
                            <Text weight={700} size="lg">Performance</Text>
                        </Group>
                        <RingProgress
                            size={80}
                            thickness={8}
                            roundCaps
                            sections={[{value: 80, color: 'teal'}]}
                            label={<Text align="center" size="md">80%</Text>}
                        />
                        <Text color="dimmed" size="sm">Efficiency rate</Text>
                    </Card>
                </Grid.Col>
            </Grid>

            <Paper shadow="md" p="lg" radius="md" mt="xl">
                <Title order={3} mb="md">Sales Overview</Title>
                {/* เพิ่มกราฟแสดงข้อมูล */}
                <Text>Graph or chart displaying sales data here...</Text>
            </Paper>
        </Container>
    );
}
