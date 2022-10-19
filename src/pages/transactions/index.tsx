import { Alert, Box, Button, Link, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, TextField, Typography } from "@mui/material";
import { authenticate } from "../../lib/jwt";
import axios from 'axios';
import { format, fromUnixTime } from "date-fns";
import { useState } from "react";
import { HodlBorderedBox } from "../../components/HodlBorderedBox";
import Head from "next/head";
import { SuccessModal } from "../../components/modals/SuccessModal";
import { FailureModal } from "../../components/modals/FailureModal";
import { getUser } from "../api/user/[handle]";
import useSWR from "swr";


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

export default function Transaction({ address, user }) {

    const [value, setValue] = useState(0); // tab

    const { data: pendingTxs } = useSWR(
        [`/api/transactions/pending`, 0, 100],
        (url, offset, limit) => axios.get(`${url}?offset=${offset}&limit=${limit}`).then(r => r.data)
    );

    const { data: processedTxs } = useSWR(
        [`/api/transactions/processed`, 0, 100],
        (url, offset, limit) => axios.get(`${url}?offset=${offset}&limit=${limit}`).then(r => r.data)
    );


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
                                setValue(1);
                            }}
                            key={1}
                            value={1}
                            label="Processed Transactions"
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
                                setValue(0);
                            }}
                            key={0}
                            value={0}
                            label="Pending Transactions"
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
                            <Box mb={2}>
                                <Typography mb={1}>
                                    This is the set of transactions that have been queued for processing.
                                </Typography>
                                <Typography mb={1}>
                                    A Tx will remain queued until it is confirmed on the blockchain, and any previously pending transactions have completed.
                                </Typography>
                                <Typography mb={1}>

                                </Typography>
                            </Box>
                            <Box sx={{ overflow: "auto" }}>
                                <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Tx Hash</TableCell>
                                                <TableCell>Nonce</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {/* {pendingTxs && JSON.stringify(pendingTxs.items)} */}
                                            {pendingTxs && pendingTxs.items.map(({ hash, nonce }) => (
                                                <TableRow key={hash}>
                                                    <TableCell>
                                                        <Link href={`https://mumbai.polygonscan.com/tx/${hash}`}>
                                                            <Typography
                                                                sx={{
                                                                    display: 'inline-block',
                                                                    inlineSize: {
                                                                        xs: 200,
                                                                        sm: 300,
                                                                        md: 400,
                                                                        lg: 500,
                                                                        xl: 700
                                                                    },
                                                                    overflowWrap: 'break-word'
                                                                }}>
                                                                {hash}
                                                            </Typography>
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>{nonce}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Box>
                            </Box>
                        </Box>
                    </div>
                    <div hidden={value !== 1}>
                        <Box marginY={4}>
                            <Box mb={2}>
                                <Typography mb={1}>
                                    This is the set of your transactions that we have successfully processed.
                                </Typography>
                                <Typography mb={1}>
                                    If your latest transaction is not here, it might still be queued for processing.
                                </Typography>
                                <Typography mb={1}>
                                    You can check the Pending Transactions tab for it.
                                </Typography>
                            </Box>
                            <Box sx={{ overflow: "auto" }}>
                                <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Tx Hash</TableCell>
                                                <TableCell>Time Processed</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {processedTxs && processedTxs.items.map(({ hash, timestamp }) => (
                                                <TableRow key={hash}>
                                                    <TableCell>
                                                        <Link href={`https://mumbai.polygonscan.com/tx/${hash}`}>
                                                            <Typography
                                                                sx={{
                                                                    display: 'inline-block',
                                                                    inlineSize: {
                                                                        xs: 200,
                                                                        sm: 300,
                                                                        md: 400,
                                                                        lg: 500,
                                                                        xl: 700
                                                                    },
                                                                    overflowWrap: 'break-word'
                                                                }}>
                                                                {hash}
                                                            </Typography>
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>{format(fromUnixTime(timestamp / 1000), 'LLL do, yyyy, HH:mm:ss')}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Box>
                            </Box>
                        </Box>
                    </div>
                </HodlBorderedBox>
            </Box>
        </>)
}