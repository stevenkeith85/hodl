import { Typography, Box } from "@mui/material"
import { indigo } from "@mui/material/colors";


import { format, fromUnixTime } from "date-fns";
import { ResponsiveContainer, CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis, Label } from "recharts";
import { HodlBorderedBox } from "../HodlBorderedBox";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const { buyer, price, seller, timestamp } = payload[0].payload;

        const formattedDate = format(fromUnixTime(timestamp), 'LLL do, yyyy');
        return (
            <HodlBorderedBox
                sx={{
                    background: 'white'
                }}
            >
                <Box
                    display="grid"
                    gridTemplateColumns={"1fr 1fr"}
                    gap={1}
                >
                    <Typography>buyer:</Typography>
                    <Typography>{buyer}</Typography>
                    <Typography>price:</Typography>
                    <Typography>{price} matic</Typography>
                    <Typography>seller:</Typography>
                    <Typography>{seller}</Typography>
                    <Typography>date:</Typography>
                    <Typography>{formattedDate}</Typography>
                </Box>
            </HodlBorderedBox>
        );
    }

    return null;
};

const CustomTick = ({ x, y, stroke, payload }) => {

    if (!payload.value) {
        return;
    }

    const formattedDate = format(fromUnixTime(payload.value), "dd/MM");

    return (
        <g>
            <text x={x - 18} y={y + 18}>
                {formattedDate}
             </text>
        </g>
    );
};

export const PriceHistory = ({ priceHistory }) => {

    console.log(priceHistory)
    if (!priceHistory.length) {
        return null;
    }

    return (
        <HodlBorderedBox>
            <Typography variant="h2" sx={{ marginBottom: 2 }}>History</Typography>
            <ResponsiveContainer
                width={'100%'}
                height={300}>
                <LineChart
                
                    // width={800}
                    // height={400}
                    margin={{
                        left: 0,
                        bottom: 20,
                        top: 20,
                        right: 40
                    }}
                    data={priceHistory}
                >
                    <Line dataKey="price" stroke={indigo[500]} />
                    <CartesianGrid stroke="#ddd" strokeDasharray="5" />
                    <XAxis dataKey="timestamp" tick={<CustomTick />}>
                        <Label position="bottom">Date</Label>
                    </XAxis>
                    <YAxis>
                        <Label position="insideLeft" >Matic</Label>
                    </YAxis>
                    <Tooltip content={
                        // @ts-ignore
                        <CustomTooltip />
                    } />

                </LineChart>
            </ResponsiveContainer>
        </HodlBorderedBox>
    )
}