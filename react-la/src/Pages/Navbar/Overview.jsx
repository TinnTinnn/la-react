import { Card, Text, Grid, Container, Group, Title, RingProgress, Paper } from '@mantine/core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
    { date: 'Jan', apples: 4000, oranges: 2400, tomatoes: 2400 },
    { date: 'Feb', apples: 3000, oranges: 1398, tomatoes: 2210 },
    { date: 'Mar', apples: 2000, oranges: 9800, tomatoes: 2290 },
    { date: 'Apr', apples: 2780, oranges: 3908, tomatoes: 2000 },
    { date: 'May', apples: 1890, oranges: 4800, tomatoes: 2181 },
];

export default function Overview() {
    return (
        <Container size="xl" style={{ marginTop: '50px' }}>
            <Title order={2} align="center" mb="lg">
                Dashboard Overview
            </Title>

            {/* ส่วนบนสำหรับแสดงข้อมูลทั่วไป */}
            <Grid gutter="xl">
                <Grid.Col span={3}>
                    <Card shadow="md" padding="lg" radius="md" withBorder>
                        <Group position="apart">
                            <Text weight={700} size="lg">Users</Text>
                        </Group>
                        <Text size="xl" weight={600}>1,254</Text>
                        <Text color="dimmed" size="sm">Active users this month</Text>
                    </Card>
                </Grid.Col>

                <Grid.Col span={3}>
                    <Card shadow="md" padding="lg" radius="md" withBorder>
                        <Group position="apart">
                            <Text weight={700} size="lg">Revenue</Text>
                        </Group>
                        <Text size="xl" weight={600}>$12,345</Text>
                        <Text color="dimmed" size="sm">Total revenue this month</Text>
                    </Card>
                </Grid.Col>

                <Grid.Col span={3}>
                    <Card shadow="md" padding="lg" radius="md" withBorder>
                        <Group position="apart">
                            <Text weight={700} size="lg">Performance</Text>
                        </Group>
                        <RingProgress
                            size={80}
                            thickness={8}
                            roundCaps
                            sections={[{ value: 80, color: 'teal' }]}
                            label={<Text align="center" size="md">80%</Text>}
                        />
                        <Text color="dimmed" size="sm">Efficiency rate</Text>
                    </Card>
                </Grid.Col>

                <Grid.Col span={3}>
                    <Card shadow="md" padding="lg" radius="md" withBorder>
                        <Group position="apart">
                            <Text weight={700} size="lg">Sales</Text>
                        </Group>
                        <Text size="xl" weight={600}>$10,000</Text>
                        <Text color="dimmed" size="sm">Total sales this month</Text>
                    </Card>
                </Grid.Col>
            </Grid>

            {/* ส่วนล่างสำหรับแสดงข้อมูลรายละเอียด */}
            <Paper shadow="md" p="lg" radius="md" mt="sm">
                <Title order={3} mb="md">Sales Overview</Title>
                <LineChart width={600} height={300} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="apples" stroke="indigo" />
                    <Line type="monotone" dataKey="oranges" stroke="blue" />
                    <Line type="monotone" dataKey="tomatoes" stroke="teal" />
                </LineChart>
            </Paper>
        </Container>
    );
}