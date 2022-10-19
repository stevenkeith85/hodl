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
    const [hash, setHash] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [failureModalOpen, setFailureModalOpen] = useState(false);

    const [value, setValue] = useState(0); // tab

    const [errorMessage, setErrorMessage] = useState('The transaction was not queued. Please contact support if you need help');

    const { data: pendingTxs } = useSWR(
        [`/api/transactions/pending`, 0, 100],
        (url, offset, limit) => axios.get(`${url}?offset=${offset}&limit=${limit}`).then(r => r.data)
    );

    const { data: processedTxs } = useSWR(
        [`/api/transactions/processed`, 0, 100],
        (url, offset, limit) => axios.get(`${url}?offset=${offset}&limit=${limit}`).then(r => r.data)
    );

    const sendTransaction = async () => {
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
            setErrorMessage(e.response.data.message)
            setFailureModalOpen(true);
            console.log(e)
        }
    }
    return (
        <>
            <Head>
                <meta name="robots" content="noindex" />
            </Head>
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
                message={errorMessage}
            />
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
                            Please read carefully; and only use this if support asks you to
                        </Alert>
                        <Typography marginY={2} sx={{ fontSize: 18, fontWeight: 500 }}>
                            Requeue a lost transaction
                        </Typography>
                        <Typography mb={2} color={theme => theme.palette.text.secondary} sx={{ span: { fontWeight: 600 } }}>
                            We only update our website once a transaction is confirmed on the blockchain.
                        </Typography>
                        <Typography mb={2} color={theme => theme.palette.text.secondary} sx={{ span: { fontWeight: 600 } }}>
                            We automatically process that transaction; and usually do not require any user intervention.
                        </Typography>
                        <Typography mb={2} color={theme => theme.palette.text.secondary} sx={{ span: { fontWeight: 600 } }}>
                            On very rare occurrences, we may fail to process the transaction. e.g. It took an exceptionally long time to confirm on the blockchain.
                        </Typography>
                        <Typography mb={2} color={theme => theme.palette.text.secondary} sx={{ span: { fontWeight: 600 } }}>
                            If your transaction <span>was</span> confirmed on the blockchain, and we haven&apos;t processed the transaction; please contact support!!
                        </Typography>
                        <Typography mb={2} color={theme => theme.palette.text.secondary} sx={{ span: { fontWeight: 600 } }}>
                            They can likely resolve the issue for you.
                        </Typography>
                        <Typography mb={2} color={theme => theme.palette.text.secondary}>
                            If support has directed you to this page, then they&apos;ve determined you need to requeue the transaction. You should use the form below to do this.
                        </Typography>
                        <Typography mb={2} color={theme => theme.palette.text.secondary}>
                            Before submitting this form, ensure that:
                        </Typography>
                        <Typography component="ul" mb={2}>
                            <Typography component="li" mb={1} color={theme => theme.palette.text.secondary} >You&apos;ve contacted support!</Typography>
                            <Typography component="li" mb={1} color={theme => theme.palette.text.secondary} >We haven&apos;t already processed that transaction.</Typography>
                            <Typography component="li" mb={1} color={theme => theme.palette.text.secondary} >The transaction has been confirmed on the blockchain.</Typography>
                            <Typography component="li" mb={1} color={theme => theme.palette.text.secondary} >The transaction is for one of our contracts.</Typography>
                            <Typography component="li" mb={1} color={theme => theme.palette.text.secondary} >The transaction you are about to submit is the first one we&apos;ve missed. This will be the first one in the pending queue; or if that is empty; the one with the lowest nonce value in MetaMask</Typography>
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                paddingY: 2
                            }}>
                            <TextField
                                sx={{ width: 600 }}
                                id="tx"
                                value={hash}
                                onChange={e => setHash(e.target.value)}
                                label="Transaction ID (Hash)"
                            />
                            <Button
                                // disabled={buttonDisabled}
                                sx={{
                                    marginX: 2,
                                    paddingY: 1.5,
                                    paddingX: 3
                                }}
                                variant="contained"
                                onClick={() => {
                                    sendTransaction();
                                    setButtonDisabled(true);
                                }}>
                                Submit
                            </Button>
                        </Box>
                        <Link target={"_blank"} href="https://metamask.zendesk.com/hc/en-us/articles/4413442094235-How-to-find-a-transaction-ID">
                            <Typography mb={2} color={theme => theme.palette.text.secondary}>
                                You can get your transaction ID from MetaMask.
                            </Typography>
                        </Link>
                    </Box>

                </HodlBorderedBox>
            </Box>
        </>)
}