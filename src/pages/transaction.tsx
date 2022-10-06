import { Alert, AlertTitle, Box, Button, FormControl, Link, TextField, Typography } from "@mui/material";
import { authenticate } from "../lib/jwt";
import axios from 'axios';

import { useState } from "react";
import { HodlBorderedBox } from "../components/HodlBorderedBox";
import Head from "next/head";
import { SuccessModal } from "../components/modals/SuccessModal";
import { FailureModal } from "../components/modals/FailureModal";
import { validTxHashFormat } from "../lib/utils";
import { getUser } from "./api/user/[handle]";


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

    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [failureModalOpen, setFailureModalOpen] = useState(false);

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
                    When your transaction has been confirmed on the blockchain, we&pos;ll update our database and send you a notification.
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
            <Box margin={4}>
                <HodlBorderedBox
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}
                >
                    <Box mb={4}>
                        <Alert
                            severity="error"
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                fontWeight: 600,
                                fontSize: {
                                    xs: 14,
                                    sm: 18
                                },
                                padding: 1,
                            }}
                        >
                            Do NOT use this form unless instructed to by support
                        </Alert>
                        <Typography marginY={2} sx={{ fontSize: 20, fontWeight: 600 }}>
                            Re-Queue a Missed Transaction
                        </Typography>
                        <Box sx={{ paddingY: 1 }}>
                            <Typography sx={{ fontWeight: 600, fontSize: 20, color: 'red' }}>READ CAREFULLY</Typography>
                        </Box>
                        <Box sx={{ paddingY: 2 }}>
                            <Typography mb={2} color={theme => theme.palette.text.secondary} sx={{ fontSize: 16, span: { fontStyle: 'italic', fontWeight: 600 } }}>
                                <span>Occassionally</span> your transaction succeeds on the blockchain, but the service to update our website fails.
                            </Typography>
                            <Typography mb={2} color={theme => theme.palette.text.secondary} sx={{ fontSize: 16 }}>
                                If that happens, you can re-queue your transaction with this form.
                            </Typography>
                        </Box>
                        <Box sx={{ paddingY: 2 }}>
                            <Typography mb={2} color={theme => theme.palette.text.secondary} sx={{ fontSize: 16 }}>
                                Missed transactions MUST be submitted in the correct order.
                            </Typography>
                            <Typography mb={2} color={theme => theme.palette.text.secondary} sx={{ fontSize: 16 }}>
                                You should WAIT for a notification that a missed transaction has been correctly handled BEFORE queuing a second one.
                            </Typography>
                            <Typography mb={2} color={theme => theme.palette.text.secondary} sx={{ fontSize: 16 }}>
                                (Contact support again if you do not receive the notification in a reasonable time frame.)
                            </Typography>
                        </Box>
                        <Box sx={{ paddingY: 2 }}>
                            <Typography mb={2} color={theme => theme.palette.text.secondary} sx={{ fontSize: 16 }}>
                                The last nonce (unique identifier) we have successfully processed from your wallet was: {user?.nonce}
                            </Typography>
                            <Typography mb={2} color={theme => theme.palette.text.secondary} sx={{ fontSize: 16 }}>
                                You should submit the first transaction (to our contract) with a nonce value GREATER than {user?.nonce}
                            </Typography>
                        </Box>
                        <Box sx={{ paddingY: 2 }}>
                            <Typography mb={2} color={theme => theme.palette.text.secondary} sx={{ fontSize: 16 }}>
                                You can get your transaction ID (and check the nonce value) in Metamask. See the link below:
                            </Typography>
                            <Link target={"_blank"} href="https://metamask.zendesk.com/hc/en-us/articles/4413442094235-How-to-find-a-transaction-ID">
                                <Typography color={theme => theme.palette.text.secondary} sx={{ fontSize: 16 }}>
                                    How do I find my Transaction ID ?
                                </Typography>
                            </Link>
                        </Box>
                        <Box
                            component="form"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center'
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={2} sx={{ marginY: 4 }}>
                                <Box>
                                    <TextField
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
                                        onClick={sendTransaction}>
                                        Submit
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </HodlBorderedBox>
            </Box>
        </>)
}