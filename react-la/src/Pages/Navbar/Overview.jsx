import {Grid, Container, Title,} from '@mantine/core';
import {useContext, useEffect, useState} from "react";
import MemberStatsCard from "../../components/Overviews/MemberStatsCard.jsx";
import MembershipExpirationChart from "../../components/Overviews/MembershipExpirationChart.jsx";
import MemberShipTypeCard from "../../components/Overviews/MemberShipTypeCard.jsx";
import MemberAge from "../../components/Overviews/MemberAge.jsx";
import MemberRegistered from "../../components/Overviews/MemberRegistered.jsx";
import {AppContext} from "../../Context/AppContext.jsx";


export default function Overview() {
    const {user} = useContext(AppContext);
    const [stats, setStats] = useState({
        totalMembers: 0,
        newMembers: 0,
        todayMembers: 0,
        activeMembers: 0,
        expiredMembers: 0,
        membershipType: {Platinum: 0, Gold: 0, Silver: 0, Bronze: 0,},
        ageRanges: {"10-20": 0, "21-30": 0, "31-40": 0, "41-50": 0, "51-60": 0,},
        registeredMembers: {
            "January": 0,
            "February": 0,
            "March": 0,
            "April": 0,
            "May": 0,
            "June": 0,
            "July": 0,
            "August": 0,
            "September": 0,
            "October": 0,
            "November": 0,
            "December": 0
        },

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
                // console.log("API Response Data:", data); // แสดงข้อมู,จาก API

                // อัพเดท state ด้วยข้อมูลที่ได้รับจาก API
                if (res.ok) {
                    setStats({
                        totalMembers: data.totalMembers,
                        newMembers: data.newMembers,
                        todayMembers: data.todayMembers,
                        activeMembers: data.activeMembers,
                        expiredMembers: data.expiredMembers,
                        membershipType: data.membershipType,
                        ageRanges: data.ageRanges,
                        registeredMembers: data.registeredMembers,
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
        {name: 'Platinum', value: stats.membershipType.Platinum, color: '#e5e4e2'},
        {name: 'Gold', value: stats.membershipType.Gold, color: '#FFD700'},
        {name: 'Silver', value: stats.membershipType.Silver, color: '#C0C0C0'},
        {name: 'Bronze', value: stats.membershipType.Bronze, color: ' #CD7F32'},
    ];

    // จัดเตรียมข้อมูลสำหรับ Barchart
    const BarChartData = [
        {
            age: '10-20 Years',
            Male: stats.ageRanges["10-20"].Male,
            Female: stats.ageRanges["10-20"].Female,
            Other: stats.ageRanges["10-20"].Other
        },
        {
            age: '21-30 Years',
            Male: stats.ageRanges["21-30"].Male,
            Female: stats.ageRanges["21-30"].Female,
            Other: stats.ageRanges["21-30"].Other
        },
        {
            age: '31-40 Years',
            Male: stats.ageRanges["31-40"].Male,
            Female: stats.ageRanges["31-40"].Female,
            Other: stats.ageRanges["31-40"].Other
        },
        {
            age: '41-50 Years',
            Male: stats.ageRanges["41-50"].Male,
            Female: stats.ageRanges["41-50"].Female,
            Other: stats.ageRanges["41-50"].Other
        },
        {
            age: '51-60 Years',
            Male: stats.ageRanges["51-60"].Male,
            Female: stats.ageRanges["51-60"].Female,
            Other: stats.ageRanges["51-60"].Other
        },
    ]

    const LineChartData = [
        {
            date: 'Jan',
            Male: stats.registeredMembers.January.Male,
            Female: stats.registeredMembers.January.Female,
            Other: stats.registeredMembers.January.Other,
        },
        {
            date: 'Feb',
            Male: stats.registeredMembers.February.Male,
            Female: stats.registeredMembers.February.Female,
            Other: stats.registeredMembers.February.Other
        },
        {
            date: 'Mar',
            Male: stats.registeredMembers.March.Male,
            Female: stats.registeredMembers.March.Female,
            Other: stats.registeredMembers.March.Other
        },
        {
            date: 'Apr',
            Male: stats.registeredMembers.April.Male,
            Female: stats.registeredMembers.April.Female,
            Other: stats.registeredMembers.April.Other
        },
        {
            date: 'May',
            Male: stats.registeredMembers.May.Male,
            Female: stats.registeredMembers.May.Female,
            Other: stats.registeredMembers.May.Other
        },
        {
            date: 'Jun',
            Male: stats.registeredMembers.June.Male,
            Female: stats.registeredMembers.June.Female,
            Other: stats.registeredMembers.June.Other
        },
        {
            date: 'Jul',
            Male: stats.registeredMembers.July.Male,
            Female: stats.registeredMembers.July.Female,
            Other: stats.registeredMembers.July.Other
        },
        {
            date: 'Aug',
            Male: stats.registeredMembers.August.Male,
            Female: stats.registeredMembers.August.Female,
            Other: stats.registeredMembers.August.Other
        },
        {
            date: 'Sep',
            Male: stats.registeredMembers.September.Male,
            Female: stats.registeredMembers.September.Female,
            Other: stats.registeredMembers.September.Other
        },
        {
            date: 'Oct',
            Male: stats.registeredMembers.October.Male,
            Female: stats.registeredMembers.October.Female,
            Other: stats.registeredMembers.October.Other
        },
        {
            date: 'Nov',
            Male: stats.registeredMembers.November.Male,
            Female: stats.registeredMembers.November.Female,
            Other: stats.registeredMembers.November.Other
        },
        {
            date: 'Dec',
            Male: stats.registeredMembers.December.Male,
            Female: stats.registeredMembers.December.Female,
            Other: stats.registeredMembers.December.Other
        },
    ];


    return (

        <Container size="xl" style={{marginTop: '50px'}}>

            {/* ตรวจสอบสถานะการล็อกอินและการยืนยันอีเมล */}
            {!user ? (
                <div style={{ color: "red", marginBottom: "20px", textAlign: "center" }}>
                    You are not logged in. Please log in to access the dashboard.
                </div>
            ) : !user.isVerified ? (
                <div style={{ color: "red", marginBottom: "20px", textAlign: "center" }}>
                    Your email is not verified. Please check your inbox.
                </div>
            ) : (

                <>
                    <Title order={2} align="center" mb="lg">
                        Dashboard Overview
                    </Title>

                    {/* ส่วนบนสำหรับแสดงข้อมูลทั่วไป */}
                    <Grid gutter="xl">
                        <Grid.Col
                            span={{base: 12, md: 6, lg: 4}}>
                            <MemberStatsCard
                                totalMembers={stats.totalMembers}
                                newMembers={stats.newMembers}
                                todayMembers={stats.todayMembers}
                            />
                        </Grid.Col>

                        <Grid.Col span={{base: 12, md: 6, lg: 4}}>
                            <MembershipExpirationChart
                                activeMembers={stats.activeMembers}
                                expiredMembers={stats.expiredMembers}
                                totalMembers={stats.totalMembers}
                            />
                        </Grid.Col>

                        <Grid.Col span={{base: 12, md: 6, lg: 4}}>
                            <MemberShipTypeCard
                                DonutChartData={DonutChartData}
                            />
                        </Grid.Col>

                        <Grid.Col span={12}>

                            <MemberRegistered
                                LineChartData={LineChartData}
                            />
                        </Grid.Col>

                        <Grid.Col span={12}>
                            <MemberAge
                                BarChartData={BarChartData}
                            />
                        </Grid.Col>
                    </Grid>
                </>
            )}
        </Container>
    );

}


