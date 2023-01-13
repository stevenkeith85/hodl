
import { indigo } from "@mui/material/colors";
import axios from "axios";
import useSWR from "swr";
import { format, fromUnixTime } from "date-fns";
import { ResponsiveContainer, CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis, Label } from "recharts";
import { Fetcher } from "swr";
import { PriceHistory } from "../../models/PriceHistory";
import { HodlBorderedBox } from "../HodlBorderedBox";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { ProfileNameOrAddress } from "../avatar/ProfileNameOrAddress";
import { MaticPrice } from "../MaticPrice";


const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const { buyer, price, seller, timestamp } = payload[0].payload;

        const formattedDate = format(fromUnixTime(timestamp), 'LLL do, yyyy');
        return (
            <HodlBorderedBox
                sx={{
                    background: 'white',
                    borderColor: '#ccc'
                }}
            >
                <Box
                    display="grid"
                    gridTemplateColumns={"1fr 1fr"}
                    gap={1}
                >
                    <Typography>buyer:</Typography>
                    <ProfileNameOrAddress profileAddress={buyer}></ProfileNameOrAddress>
                    <Typography>seller:</Typography>
                    <ProfileNameOrAddress profileAddress={seller}></ProfileNameOrAddress>
                    <Typography>price:</Typography>
                    <MaticPrice price={price} color="black" fontSize={14} size={14}></MaticPrice>
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

export const PriceHistoryGraph = ({ nft, prefetchedPriceHistory = null }) => {
    const fetcher: Fetcher<PriceHistory[], [string, string]> = (url, tokenId) => axios.get(`${url}?tokenId=${tokenId}&offset=0&limit=100`).then(r => r.data.items);

    const { data: priceHistory, error } = useSWR(nft.id ? [`/api/contracts/market/token-bought/`, nft.id] : null,
        fetcher,
        { fallbackData: prefetchedPriceHistory }
    );

    // We are doing key={Date.now()} to force a rerender; as the chart doesn't seem to rerender when we get 
    // new data. :(
    return (
        <HodlBorderedBox sx={{ height: 320 }}>
            <Typography variant="h2" sx={{ padding: 0, marginBottom: 2 }}>Price History</Typography>
            {priceHistory &&
                <ResponsiveContainer
                    key={Date.now()}
                    width={'100%'}
                    height={250}>
                    <LineChart
                        margin={{
                            left: 0,
                            bottom: 20,
                            top: 20,
                            right: 40
                        }}
                        data={priceHistory}
                    >
                        <Line dataKey="price" stroke={indigo[500]} isAnimationActive={false} />
                        <CartesianGrid stroke="#ddd" strokeDasharray="5" />
                        <XAxis dataKey="timestamp" tick={
                            // @ts-ignore
                            <CustomTick />
                        }>
                            <Label position="bottom">Date</Label>
                        </XAxis>
                        <YAxis>
                        </YAxis>
                        <Tooltip content={
                            // @ts-ignore
                            <CustomTooltip />
                        } />
                    </LineChart>
                </ResponsiveContainer>
            }
        </HodlBorderedBox>
    )
}
