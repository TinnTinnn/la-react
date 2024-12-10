import {Card, Group, Text} from "@mantine/core";
import {DonutChart} from "@mantine/charts";
import PropTypes from "prop-types";



export default function MemberShipTypeCard ({DonutChartData}) {
    return (
        <Card shadow="md" padding="lg" radius="md" withBorder>
            <Group position="apart">
                <Text weight={700} size="lg">Membership Type</Text>
            </Group>
            <DonutChart
                size={185}
                data={DonutChartData}
                radius={0.8}
                strokeWidth={1}
            />
            <Text color="dimmed" size="sm">Number of members by type</Text>
        </Card>
    )
}


MemberShipTypeCard.propTypes = {
    DonutChartData: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.number,  // ค่าของข้อมูลใน chart ควรเป็น number
            label: PropTypes.string,  // label ของ chart ควรเป็น string
            color: PropTypes.string,  // color อาจจะเป็น string (เช่นรหัสสี hex หรือชื่อสี)
        })
    ),
};