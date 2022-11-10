import { useState } from "react";

import Head from "next/head";
import dynamic from 'next/dynamic';

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import { authenticate } from "../../lib/jwt";
import { HodlBorderedBox } from "../../components/HodlBorderedBox";
import { HodlLoadingSpinner } from "../../components/HodlLoadingSpinner";

const PendingTransactionsTable = dynamic(
    () => import('../../components/PendingTransactionsTable'),
    {
        ssr: false,
        loading: () => <HodlLoadingSpinner />
    }
);

const ProcessedTransactionsTable = dynamic(
    () => import('../../components/ProcessedTransactionsTable'),
    {
        ssr: false,
        loading: () => <HodlLoadingSpinner />
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

export default function Transaction({ address, limit = 10 }) {

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
