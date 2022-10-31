import { useState } from "react";

import Head from "next/head";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import TableCell from "@mui/material/TableCell";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import InfiniteScroll from "react-swr-infinite-scroll";

import { format, fromUnixTime } from "date-fns";

import { authenticate } from "../../lib/jwt";
import { HodlBorderedBox } from "../../components/HodlBorderedBox";
import { getUser } from "../api/user/[handle]";
import { useTransactions } from "../../hooks/useTransactions";
import { HodlLoadingSpinner } from "../../components/HodlLoadingSpinner";


export const PendingTransactionsTable = ({ limit = 10 }) => {

    const { swr: pendingTxsSWR } = useTransactions(limit, false);

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
            <Typography>Transaction Hash</Typography>
            <Typography m={1} sx={{ textAlign: 'right' }}>Nonce</Typography>
        </Box>
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            width: `100%`,
            height: '500px',
            overflow: 'auto',
            gap: 2,
            padding: 1
        }}>
            {pendingTxsSWR.data && pendingTxsSWR.data[0] && pendingTxsSWR.data[0].total === 0 && <Typography sx={{ color: theme => theme.palette.text.secondary }}>No Items</Typography>}
            {
                pendingTxsSWR.data &&
                <InfiniteScroll
                    swr={pendingTxsSWR}
                    isReachingEnd={isReachingEnd}
                    loadingIndicator={<HodlLoadingSpinner sx={{ paddingY: 1 }} />}
                >
                    {
                        ({ items }) => (items || []).map(({ hash, nonce }) => (
                            <>
                                <Link href={`https://mumbai.polygonscan.com/tx/${hash}`}>
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
                                <TableCell>{nonce}</TableCell>
                            </>
                        ))
                    }
                </InfiniteScroll >
            }
        </Box>

    </>)
}


export const ProcessedTransactionsTable = ({ limit = 10 }) => {

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
            <Typography>Transaction Hash</Typography>
            <Typography m={1} sx={{ textAlign: 'right' }}>Time Processed</Typography>
        </Box>
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            width: `100%`,
            height: '500px',
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
                                <Link href={`https://mumbai.polygonscan.com/tx/${hash}`}>
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

export async function getServerSideProps({ req, res }) {
    await authenticate(req, res);

    if (!req.address) {
        return { notFound: true }
    }

    const user = await getUser(req?.address, req?.address, true);

    return {
        props: {
            address: req.address || null,
            user
        }
    }
}

export default function Transaction({ address, user, limit = 10 }) {

    const [value, setValue] = useState(1); // tab
    return (
        <>
            <Head>
                <meta name="robots" content="noindex" />
            </Head>
            <Box
                sx={{
                    marginY: {
                        xs: 2,
                        sm: 4
                    },
                    marginX: {
                        xs: 0,
                        sm: 2
                    }
                }}
            >
                <HodlBorderedBox
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Tabs
                        value={value}
                        textColor="secondary"
                        indicatorColor="secondary"
                    >
                        <Tab
                            component="a"
                            onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                                setValue(0);
                            }}
                            key={0}
                            value={0}
                            label="Pending"
                            sx={{
                                minWidth: 0,
                                paddingX: {
                                    xs: 1.75,
                                    sm: 2
                                },
                                paddingY: 2,
                                margin: 0
                            }}
                        />
                        <Tab
                            component="a"
                            onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                                setValue(1);
                            }}
                            key={1}
                            value={1}
                            label="Processed"
                            sx={{
                                minWidth: 0,
                                paddingX: {
                                    xs: 1.75,
                                    sm: 2
                                },
                                paddingY: 2,
                                margin: 0
                            }}
                        />
                    </Tabs>
                    <div hidden={value !== 0}>
                        <Box marginY={4}>
                            <Box sx={{
                                margin: 1,
                                marginBottom: 4
                            }}>
                                <Typography mb={1}>
                                    This is the set of transactions that are currently queued for processing.
                                </Typography>
                            </Box>
                            <PendingTransactionsTable limit={limit} />
                        </Box>
                    </div>
                    <div hidden={value !== 1}>
                        <Box marginY={4}>
                            <Box sx={{
                                margin: 1,
                                marginBottom: 4
                            }}>
                                <Typography mb={1}>
                                    This is the set of transactions that we have successfully processed.
                                </Typography>
                            </Box>
                            <ProcessedTransactionsTable limit={limit} />
                        </Box>
                    </div>
                </HodlBorderedBox >
            </Box >
        </>)
}
