import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import InfiniteScroll from "react-swr-infinite-scroll";
import { format, fromUnixTime } from "date-fns";

import { useTransactions } from "../hooks/useTransactions";
import { HodlLoadingSpinner } from "./HodlLoadingSpinner";


export default function ProcessedTransactionsTable({ limit = 10 }) {

    const { swr: processedTxsSWR } = useTransactions(limit);

    const isReachingEnd = swr => {
        const firstPageEmpty = swr.data?.[0]?.items?.length == 0;
        const lastPageNotFull = swr.data?.[swr.data?.length - 1]?.items?.length < limit;

        return firstPageEmpty || lastPageNotFull;
    }

    return (<>
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            width: `100%`,
            paddingX: 1,
            marginBottom: 1,
            borderBottom: `1px solid #ddd`
        }}>
            <Typography m={1}>Transaction Hash</Typography>
            <Typography m={1} sx={{ textAlign: 'right' }}>Time Processed</Typography>
        </Box>
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            width: `100%`,
            maxHeight: '500px',
            overflow: 'auto',
            gap: 2,
            padding: 1
        }}>
            {
                processedTxsSWR.data &&
                <InfiniteScroll
                    swr={processedTxsSWR}
                    isReachingEnd={isReachingEnd}
                    loadingIndicator={<HodlLoadingSpinner sx={{ paddingY: 1 }} />}
                >
                    {
                        ({ items }) => (items || []).map(({ hash, timestamp }) => (
                            <>
                                <Link href={`${process.env.NEXT_PUBLIC_BLOCKCHAIN_EXPLORER}/tx/${hash}`}>
                                    <Typography
                                        sx={{
                                            display: 'inline-block',
                                            inlineSize: {
                                                xs: '50vw',
                                                lg: 'calc(1200px / 2)'
                                            },
                                            overflowWrap: 'break-word'
                                        }}>
                                        {hash}
                                    </Typography>
                                </Link>
                                <Typography sx={{ textAlign: 'right' }}>{format(fromUnixTime(timestamp / 1000), 'LLL do, yyyy, HH:mm:ss')}</Typography>
                            </>
                        ))
                    }
                </InfiniteScroll >}
        </Box>
    </>)
}
