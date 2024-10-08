import { useState } from "react";

import Head from "next/head";
import dynamic from 'next/dynamic';

import axios from 'axios';

import { authenticate } from "../../lib/jwt";
import { HodlBorderedBox } from "../../components/HodlBorderedBox";

import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import InputBase from "@mui/material/InputBase";


const SuccessModal = dynamic(
    () => import('../../components/modals/SuccessModal').then(mod => mod.SuccessModal),
    {
        ssr: false,
        loading: () => null
    }
);

const FailureModal = dynamic(
    () => import('../../components/modals/FailureModal').then(mod => mod.FailureModal),
    {
        ssr: false,
        loading: () => null
    }
);

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
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [failureModalOpen, setFailureModalOpen] = useState(false);

    const [errorMessage, setErrorMessage] = useState('The transaction was not queued. Please contact support if you need help');

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
                    <div>
                        <Alert
                            severity="error"
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                fontWeight: 600,
                                paddingY: 2,
                            }}
                        >
                            This tool is in the process of being decomissioned. We should be able to resolve your issue for you if you contact support!
                        </Alert>
                        <Typography marginY={2} sx={{ fontSize: 18, fontWeight: 500 }}>
                            Requeue a transaction
                        </Typography>
                        <Typography mb={2} color={theme => theme.palette.text.secondary} sx={{ span: { fontWeight: 600 } }}>
                            We only update our website once a transaction is confirmed on the blockchain.
                        </Typography>
                        <Typography mb={2} color={theme => theme.palette.text.secondary} sx={{ span: { fontWeight: 600 } }}>
                            We automatically process that transaction; and usually do not require any user intervention.
                        </Typography>
                        <Typography mb={2} color={theme => theme.palette.text.secondary} sx={{ span: { fontWeight: 600 } }}>
                            On very rare occurrences, we may fail to process the transaction. e.g. An application error may have prevented us from being informed about the transaction or it took an exceptionally long time to confirm on the blockchain.
                        </Typography>
                        <Typography mb={2} color={theme => theme.palette.text.secondary} sx={{ span: { fontWeight: 600 } }}>
                            If you think yourtransaction <span>was</span> confirmed on the blockchain (by inspecting your wallet or Polygonscan), and we haven&apos;t processed that transaction; please contact support!!
                        </Typography>
                        <Typography mb={2} color={theme => theme.palette.text.secondary}>
                            If support has directed you to this page, then they&apos;ve determined you need to requeue the transaction. You should use the form below to do this.
                        </Typography>
                        <Typography mb={2} color={theme => theme.palette.text.secondary}>
                            Before submitting this form, ensure that:
                        </Typography>
                        <Typography component="ul" mb={2}>
                            <Typography component="li" mb={1} color={theme => theme.palette.text.secondary} >You&apos;ve contacted support!</Typography>
                            <Typography component="li" mb={1} color={theme => theme.palette.text.secondary} >The transaction isn&apos;t currently queued for processing (see tranaction section).</Typography>
                            <Typography component="li" mb={1} color={theme => theme.palette.text.secondary} >We haven&apos;t already processed that transaction (see transaction section).</Typography>
                            <Typography component="li" mb={1} color={theme => theme.palette.text.secondary} >The transaction has been confirmed on the blockchain.(check your wallet or polygonscan)</Typography>
                            <Typography component="li" mb={1} color={theme => theme.palette.text.secondary} >The transaction is for one of our contracts.</Typography>
                            <Typography component="li" mb={1} color={theme => theme.palette.text.secondary} >The transaction you are about to submit is the first one we&apos;ve missed. The one with the lowest nonce value in your wallet</Typography>
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                paddingY: 2
                            }}>
                            <InputBase
                                sx={{ 
                                    border: `1px solid #ddd`,
                                    borderRadius: 1,
                                    padding: 1,
                                    width: 600 
                                }}
                                id="tx"
                                value={hash}
                                onChange={e => setHash(e.target.value)}
                            />
                            <Button
                                disabled={buttonDisabled}
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
                        <Link
                            target={"_blank"}
                            href="https://metamask.zendesk.com/hc/en-us/articles/4413442094235-How-to-find-a-transaction-ID">
                            <Typography mb={2} color={theme => theme.palette.text.secondary}>
                                You can get your transaction ID from MetaMask.
                            </Typography>
                        </Link>
                    </div>
                </HodlBorderedBox>
            </Box>
        </>)
}
