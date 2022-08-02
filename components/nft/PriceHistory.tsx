import { Card, CardContent, Typography, Stack, Link, Box } from "@mui/material"
import { indigo } from "@mui/material/colors";


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { format, fromUnixTime, parseISO } from "date-fns";
import { ResponsiveContainer, Legend, CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis, Label } from "recharts";
import { getShortAddress } from "../../lib/utils";
import { HodlBorderedBox } from "../HodlBorderedBox";
import { HodlLink } from "../HodlLink";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const { buyer, price, seller, timestamp } = payload[0].payload;

        const formattedDate = format(fromUnixTime(timestamp), "P");
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

    const formattedDate = format(fromUnixTime(payload.value), "P");

    return (
        <g
            transform={`translate(${x},${y})`}
        >
            <text x={45} y={0} dy={16} textAnchor="end" fill="#666">
                {formattedDate}
            </text>
        </g>
    );
};

export const PriceHistory = ({ priceHistory }) => {

    return (
        <HodlBorderedBox>
            <Typography variant="h2" sx={{ marginBottom: 2 }}>History</Typography>
        <ResponsiveContainer 
            width={'100%'} 
            height={350}>
            <LineChart
                width={800}
                height={400}
                margin={{
                    left: 10,
                    bottom: 20,
                    top: 10,
                    right: 10
                }}
                data={priceHistory}
            >
                <Line dataKey="price" type="monotone" stroke={indigo[500]} />
                <CartesianGrid stroke="#ddd" strokeDasharray="10" />
                <XAxis dataKey="timestamp" tick={<CustomTick />}>
                    <Label position="bottom">Date</Label>
                    </XAxis>
                <YAxis>
                <Label  position="insideLeft" >Matic</Label>
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