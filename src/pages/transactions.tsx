import { Alert, AlertTitle, Box, Button, FormControl, Link, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Typography } from "@mui/material";
import { authenticate } from "../lib/jwt";
import axios from 'axios';
import { format, fromUnixTime } from "date-fns";
import { useState } from "react";
import { HodlBorderedBox } from "../components/HodlBorderedBox";
import Head from "next/head";
import { SuccessModal } from "../components/modals/SuccessModal";
import { FailureModal } from "../components/modals/FailureModal";
import { validTxHashFormat } from "../lib/utils";
import { getUser } from "./api/user/[handle]";
import { Redis } from "@upstash/redis";
import { chunk } from "../lib/lodash";


export async function getServerSideProps({ req, res }) {
    await authenticate(req, res);

    if (!req.address) {
        return { notFound: true }
    }

    const user = await getUser(req?.address, req?.address, true);

    // TODO: We should move this to the API, so that we can use SWR
    const client = Redis.fromEnv();
    let txs = await client.zrange(`user:${req.address}:txs`, 0, -1, { rev: true, withScores: true });

    txs = chunk(txs, 2);
    return {
        props: {
            address: req.address || null,
            user,
            txs
        }
    }
}

export default function Transaction({ address, user, txs }) {
    const [hash, setHash] = useState('');

    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [failureModalOpen, setFailureModalOpen] = useState(false);

    const [value, setValue] = useState(0); // tab

    if (!address) {
        return null;
    }

    const sendTransaction = async () => {
        if (!validTxHashFormat(hash)) {
            return;
        }

        try {
            const r = await axios.post(
                '/api/market/transaction',
                {
                    hash,
                },
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            )

            setSuccessModalOpen(true);
        } catch (e) {
            setFailureModalOpen(true);
            console.log(e)
        }
    }
    return (
        <>
            <SuccessModal
                modalOpen={successModalOpen}
                setModalOpen={setSuccessModalOpen}>
                <Typography
                    sx={{
                        fontSize: 16,
                        color: theme => theme.palette.text.secondary
                    }}>
                    When your transaction has been confirmed on the blockchain, we&apos;ll update our database and send you a notification.
                </Typography>
            </SuccessModal>
            <FailureModal
                modalOpen={failureModalOpen}
                setModalOpen={setFailureModalOpen}
                message="The transaction was not queued. Please contact support if you need help"
            />
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
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center'
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
                            label="Transactions"
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
                            label="Queue (Advanced)"
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
                                            {txs.map(([hash, timestamp]) => (
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
                    <div hidden={value !== 1}>
                        <Box marginY={4}>
                            <Alert
                                severity="error"
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    padding: 1,
                                }}
                            >
                                Please only use this if support asks you to
                            </Alert>
                            <Typography marginY={2} sx={{ fontSize: 18, fontWeight: 500 }}>
                                Queue a lost transaction
                            </Typography>
                            <Box sx={{ paddingY: 2 }}>
                                <Typography mb={2} color={theme => theme.palette.text.secondary} sx={{ span: { fontWeight: 600 } }}>
                                    We <span>only</span> update our website once a transaction is confirmed on the blockchain.
                                </Typography>
                            </Box>

                            <Box sx={{ paddingY: 2 }}>
                                <Typography color={theme => theme.palette.text.secondary}>
                                    If your transaction was confirmed on the blockchain a while ago, and our website has not been updated;
                                </Typography>
                                <Typography color={theme => theme.palette.text.secondary}>
                                    then you can use this tool to requeue the transaction for processing.
                                </Typography>
                            </Box>

                            <Box sx={{ paddingY: 2 }}>
                                <Typography mb={2} color={theme => theme.palette.text.secondary}>
                                    Before submitting this form, ensure that:
                                </Typography>
                                <Box>
                                    <Typography component="li" mb={1} color={theme => theme.palette.text.secondary} >We haven&apos;t already processed that transaction.</Typography>
                                    <Typography component="li" mb={1} color={theme => theme.palette.text.secondary} >The transaction has been confirmed on the blockchain.</Typography>
                                    <Typography component="li" mb={1} color={theme => theme.palette.text.secondary} >The transaction is for one of our contracts.</Typography>
                                    <Typography component="li" mb={1} color={theme => theme.palette.text.secondary} >The transaction you are about to submit is the first one we&apos;ve missed</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ paddingY: 2 }}>
                                <Link target={"_blank"} href="https://metamask.zendesk.com/hc/en-us/articles/4413442094235-How-to-find-a-transaction-ID">
                                    <Typography mb={2} color={theme => theme.palette.text.secondary}>
                                        You can get your transaction ID from Metamask.
                                    </Typography>
                                </Link>
                            </Box>
                            <Box sx={{ marginY: 2 }}>
                                <Box mb={2}>
                                    <TextField
                                        sx={{ width: 250 }}
                                        id="tx"
                                        value={hash}
                                        onChange={e => setHash(e.target.value)}
                                        label="Transaction ID (Hash)"
                                    />
                                </Box>
                                <Box>
                                    <Button
                                        sx={{ paddingY: 1.5, paddingX: 2.5, fontWeight: 600 }}
                                        variant="contained"
                                        onClick={() => sendTransaction()}>
                                        Submit
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </div>
                </HodlBorderedBox>
            </Box>
        </>)
}