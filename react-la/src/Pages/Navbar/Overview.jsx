import { Card, Text, Grid, Container, Group, Title,  Paper } from '@mantine/core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {useEffect, useState} from "react";
import MemberStatsCard from "../../components/Overviews/MemberStatsCard.jsx";
import MembershipExpirationChart from "../../components/Overviews/MembershipExpirationChart.jsx";

const fakedata = [
    { date: 'Jan', apples: 4000, oranges: 2400, tomatoes: 2400 },
    { date: 'Feb', apples: 3000, oranges: 1398, tomatoes: 2210 },
    { date: 'Mar', apples: 2000, oranges: 9800, tomatoes: 2290 },
    { date: 'Apr', apples: 2780, oranges: 3908, tomatoes: 2000 },
    { date: 'May', apples: 1890, oranges: 4800, tomatoes: 2181 },
];

export default function Overview() {
    const [stats, setStats] = useState({
        totalMembers: 0,
        newMembers: 0,
        activeMembers: 0,
        expiredMembers: 0,
    });

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/members/stats', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();

                // อัพเดท state ด้วยข้อมูลที่ได้รับจาก API
                if (res.ok) {
                    setStats({
                        totalMembers: data.totalMembers,
                        newMembers: data.newMembers,
                        activeMembers: data.activeMembers,
                        expiredMembers: data.expiredMembers,
                    });
                } else {
                    console.error("Failed to fetch member stats", data);
                }
            } catch (error) {
                console.error("Error fetching member stats:", error);
            }
        }

        fetchStats();
    }, []);  // useEffect จะทำงานแค่ครั้งเดียวเมื่อ component ถูก mount


    return (
        <Container size="xl" style={{ marginTop: '50px' }}>
            <Title order={2} align="center" mb="lg">
                Dashboard Overview
            </Title>

            {/* ส่วนบนสำหรับแสดงข้อมูลทั่วไป */}
            <Grid gutter="xl">
                <Grid.Col span={4}>
                    <MemberStatsCard
                        totalMembers={stats.totalMembers}
                        newMembers={stats.newMembers}
                    />
                </Grid.Col>

                <Grid.Col span={4}>
                    <Card shadow="md" padding="lg" radius="md" withBorder>
                        <Group position="apart">
                            <Text weight={700} size="lg">Revenue</Text>
                        </Group>
                        <MembershipExpirationChart
                            activeMembers={stats.activeMembers}
                            expiredMembers={stats.expiredMembers}
                        />
                        <Text color="dimmed" size="sm">Total revenue this month</Text>
                    </Card>
                </Grid.Col>

                <Grid.Col span={4}>
                    <Card shadow="md" padding="lg" radius="md" withBorder>
                    </Card>
                </Grid.Col>
            </Grid>

            {/* ส่วนล่างสำหรับแสดงข้อมูลรายละเอียด */}
            <Paper shadow="md" p="lg" radius="md" mt="sm">
                <Title order={3} mb="md">Sales Overview</Title>
                <LineChart width={600} height={300} data={fakedata}>
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