import {Card, Group,Text, } from "@mantine/core";
import {LineChart} from "@mantine/charts";



export default function  MemberRegistered({LineChartData}) {
    return (
        <Card shadow="md" padding="lg" radius="md" withBorder>
            <Group position="apart">
                <Text weight={700} size="lg">Member Register Overview</Text>
            </Group>
            <LineChart
                h={300}
                data={LineChartData}
                dataKey="date"
                withLegend
                series={[
                    { name: 'Male', color: 'red.6' },
                    { name: 'Female', color: 'teal.6' },
                    { name: 'Other', color: 'indigo.6' },
                ]}
                curveType="natural"
            />
        </Card>
    )
}