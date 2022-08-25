import { Box, Button, FormControl, FormHelperText, Input, InputLabel, Stack, TextField, Typography } from "@mui/material";
import TwitterIcon from '@mui/icons-material/Twitter';
import { grey } from '@mui/material/colors';
import { Reddit, RocketLaunch } from "@mui/icons-material";
import { authenticate } from "../lib/jwt";
import axios from 'axios';

import { useState } from "react";
import { HodlBorderedBox } from "../components/HodlBorderedBox";

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

    if (!address) {
        return null;
    }

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

            alert('Successfully queued the transaction');
        } catch (e) {
            alert('Sorry, we could not queue that transaction');
            console.log(e)
        }
    }
    return (
        <Box
            sx={{
                margin: 4,
                padding: 4,
                textAlign: 'center'
            }}
        >
            <HodlBorderedBox>
                <Typography variant="h1" mb={2} sx={{ fontSize: '18px' }}>Retry Transaction</Typography>
                <Typography mb={2} sx={{ color: theme => theme.palette.error.main }}>Do not use this form unless instructed to by support!</Typography>
                <Typography mb={2}>
                    Occassionally your transaction succeeds on the blockchain,
                    but the service to update our website fails.
                </Typography>
                {/* 
                    TODO: We should allow the user to run any transaction that has been missed. (or block them running transactions that would get us out of sync with the blockchain)
                    We need to think of ways of doing this...
                */}
                <Typography mb={2}>
                    If that happens, and you have not triggered a later market transaction, then
                    you can re-queue your transaction with this form</Typography>
                <Typography mb={2}>
                    Need help finding your transaction hash?<br />
                    https://metamask.zendesk.com/hc/en-us/articles/4413442094235-How-to-find-a-transaction-ID
                </Typography>
                <Box
                    component="form"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: 4
                    }}
                >
                    <FormControl>
                        <TextField
                            id="tx"
                            value={hash}
                            onChange={e => setHash(e.target.value)}
                            label="hash"
                        />
                    </FormControl>
                    <Box>
                        <Button
                            onClick={sendTransaction}>
                            Submit
                        </Button>
                    </Box>
                </Box>
            </HodlBorderedBox>
        </Box>)
}