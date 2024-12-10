import {Grid, Container, Title, Paper,} from '@mantine/core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {useEffect, useState} from "react";
import MemberStatsCard from "../../components/Overviews/MemberStatsCard.jsx";
import MembershipExpirationChart from "../../components/Overviews/MembershipExpirationChart.jsx";
import MemberShipTypeCard from "../../components/Overviews/MemberShipTypeCard.jsx";
import MemberAge from "../../components/Overviews/MemberAge.jsx";

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
        membershipType: { Platinum: 0, Gold: 0, Silver: 0 , Bronze: 0 ,},
        ageRanges: {"10-20": 0, "21-30": 0, "31-40": 0, "41-50": 0, "51-60":0}
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
                console.log("API Response Data:", data); // แสดงข้อมู,จาก API

                // อัพเดท state ด้วยข้อมูลที่ได้รับจาก API
                if (res.ok) {
                    setStats({
                        totalMembers: data.totalMembers,
                        newMembers: data.newMembers,
                        activeMembers: data.activeMembers,
                        expiredMembers: data.expiredMembers,
                        membershipType: data.membershipType,
                        ageRanges: data.ageRanges,
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


// จัดเตรียมข้อมูลสำหรับ DonutChart
    const DonutChartData = [
        { name: 'Platinum', value: stats.membershipType.Platinum, color: '#e5e4e2'},
        { name: 'Gold', value:  stats.membershipType.Gold, color: '#FFD700'},
        { name: 'Silver', value:  stats.membershipType.Silver, color: '#C0C0C0'},
        { name: 'Bronze', value:  stats.membershipType.Bronze, color: ' #CD7F32'},
    ];

    // จัดเตรียมข้อมูลสำหรับ Barchart
    const BarChartData = [
        { age: '10-20', Male: 1200, Female: 900, Other: 200 },
        { age: '21-30', Male: 1900, Female: 1200, Other: 400 },
        { age: '31-40', Male: 400, Female: 1000, Other: 200 },
        { age: '41-50', Male: 1000, Female: 200, Other: 800 },
        { age: '51-60', Male: 800, Female: 1400, Other: 1200 },
    ]


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
                        <MembershipExpirationChart
                            activeMembers={stats.activeMembers}
                            expiredMembers={stats.expiredMembers}
                            totalMembers={stats.totalMembers}
                        />
                </Grid.Col>

                <Grid.Col span={4}>
                    <MemberShipTypeCard
                        DonutChartData={DonutChartData}
                    />
                </Grid.Col>

                <Grid.Col span={12}>
                    <MemberAge
                         BarChartData={BarChartData}
                    />
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