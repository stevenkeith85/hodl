import { Typography, Box } from "@mui/material"
import { indigo } from "@mui/material/colors";
import axios from "axios";
import useSWR from "swr";
import { format, fromUnixTime } from "date-fns";
import { ResponsiveContainer, CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis, Label } from "recharts";
import { Fetcher } from "swr";
import { PriceHistory } from "../../models/PriceHistory";
import { HodlBorderedBox } from "../HodlBorderedBox";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";

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

    try {
        const formattedDate = format(fromUnixTime(payload.value), "dd/MM");

        return (
            <g>
                <text x={x - 18} y={y + 18}>
                    {formattedDate}
                </text>
            </g>
        );
    } catch (e) {
        return payload.value;
    }
};

export const PriceHistoryGraph = ({ nft, fallbackData }) => {
    const fetcher: Fetcher<PriceHistory[], [string, string]> = (url, query) => axios.get(`${url}/${query}`).then(r => r.data.priceHistory);

    const { data: priceHistory, error } = useSWR(nft.id ? [`/api/token-bought/`, nft.id] : null,
        fetcher,
        { fallbackData }
    );

    if (!priceHistory && !error) {
        return <HodlBorderedBox>
            <Typography variant="h2" sx={{ marginBottom: 2 }}>History</Typography>
            <HodlLoadingSpinner />
        </HodlBorderedBox>
    }

    // We are doing key={Date.now()} to force a rerender; as the chart doesn't seem to rerender when we get 
    // new data. :(
    return (
        <HodlBorderedBox>
            <Typography variant="h2" sx={{ marginBottom: 2 }}>History</Typography>
            <ResponsiveContainer
                key={Date.now()}
                width={'100%'}
                height={300}>
                <LineChart
                    margin={{
                        left: 0,
                        bottom: 20,
                        top: 20,
                        right: 40
                    }}
                    data={priceHistory}
                >
                    <Line dataKey="price" stroke={indigo[500]} isAnimationActive={true} />
                    <CartesianGrid stroke="#ddd" strokeDasharray="5" />
                    <XAxis dataKey="timestamp" tick={
                        // @ts-ignore
                        <CustomTick />
                    }>
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