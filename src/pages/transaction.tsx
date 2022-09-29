import { Alert, AlertTitle, Box, Button, FormControl, Link, TextField, Typography } from "@mui/material";
import { authenticate } from "../lib/jwt";
import axios from 'axios';

import { useState } from "react";
import { HodlBorderedBox } from "../components/HodlBorderedBox";
import Head from "next/head";
import { SuccessModal } from "../components/modals/SuccessModal";
import { FailureModal } from "../components/modals/FailureModal";
import { validTxHashFormat } from "../lib/utils";


export async function getServerSideProps({ req, res }) {
    await authenticate(req, res);

    if (!req.address) {
        return { notFound: true }
    }

    return {
        props: {
            address: req.address || null,
        }
    }
}

export default function Transaction({ address }) {
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
                    When your transaction has been confirmed on the blockchain, we'll update our database and send you a notification.
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
                                margin: 4,
                                fontWeight: 600,
                                fontSize: 18,
                                padding: 1,
                            }}
                        >
                            Do not use this form unless instructed to by support
                        </Alert>
                        <Typography mb={2} sx={{ fontSize: 20, fontWeight: 600 }}>
                            Re-Queue Transaction
                        </Typography>
                        <Typography mb={2} color={theme => theme.palette.text.secondary} sx={{ fontSize: 16, span: { fontStyle: 'italic' } }}>
                            <span>Occassionally</span> your transaction succeeds on the blockchain, but the service to update our website fails.
                        </Typography>
                        <Typography mb={2} color={theme => theme.palette.text.secondary} sx={{ fontSize: 16 }}>
                            If that happens, you can re-queue your transaction with this form
                        </Typography>
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
                                        label="Tx Hash"
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
                            <Link target={"_blank"} href="https://metamask.zendesk.com/hc/en-us/articles/4413442094235-How-to-find-a-transaction-ID">
                                <Typography color={theme => theme.palette.text.secondary} sx={{ fontSize: 16 }}>
                                    How do I find my transaction hash?
                                </Typography>
                            </Link>
                        </Box>
                    </Box>
                </HodlBorderedBox>
            </Box>
        </>)
}