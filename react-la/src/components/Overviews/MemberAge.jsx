import {Card, Group, Text} from "@mantine/core";
import {BarChart} from "@mantine/charts";



export default function MemberAge({BarChartData}) {
    return  (
        <Card shadow="md" padding="lg" radius="md" withBorder>
            <Group position="apart">
                <Text weight={700} size="lg">Member Age</Text>
            </Group>
            <BarChart
                h={200}
                data={BarChartData}
                dataKey="age"
                withLegend
                series={[
                    { name: 'Male', color: 'blue.6' },
                    { name: 'Female', color: 'teal.6' },
                    { name: 'Other', color: 'violet.6' },
                ]}
                tickLine="y"
            />
        </Card>
    )
}