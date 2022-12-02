import { Box, Button, FormControl, FormHelperText, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { WalletContext } from '../../contexts/WalletContext';
import { enqueueSnackbar } from 'notistack';
import { buyNft, delistNft, listNft } from "../../lib/nft";
import { ListModal } from "../modals/ListModal";
import { SuccessModal } from "../modals/SuccessModal";
import { Token } from "../../models/Token";
import { MutableToken } from "../../models/MutableToken";


const TransactionModal = ({ modalOpen, setModalOpen }) => {
    return (
        <SuccessModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen} >
            <Typography
                sx={{
                    fontSize: 16,
                    color: theme => theme.palette.text.secondary,
                    span: {
                        fontWeight: 600
                    }
                }}>
                When your transaction has been <span>confirmed</span> on the blockchain,
                we&apos;ll update our database and send you a notification.
            </Typography>
            <Typography
                sx={{
                    fontSize: 16,
                    color: theme => theme.palette.text.secondary
                }}>
                Please wait until this process completes before triggering another transaction.
            </Typography>
            <Typography
                sx={{
                    fontSize: 16,
                    color: theme => theme.palette.text.secondary
                }}>
                You can continue browsing the site whilst waiting.
            </Typography>
        </SuccessModal >
    )
}

interface NftActionButtons {
    token: Token;
    mutableToken: MutableToken
}

export const NftActionButtons = ({
    token,
    mutableToken }) => {
    const { address, signer } = useContext(WalletContext);
    const [listModalOpen, setListModalOpen] = useState(false);
    const [delistModalOpen, setDelistModalOpen] = useState(false);
    const [listedModalOpen, setListedModalOpen] = useState(false);
    const [boughtModalOpen, setBoughtModalOpen] = useState(false);

    const [price, setPrice] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isHodler = () => Boolean(mutableToken?.hodler?.toLowerCase() === address?.toLowerCase());

    // if this changes then the user has successfully, listed/delisted/bought reenable the button
    useEffect(() => {
        setLoading(false);
    }, [mutableToken.forSale])

    useEffect(() => {
        const displayError = async () => {
            const enqueueSnackbar = await import('notistack').then(mod => mod.enqueueSnackbar);

            if (!error) {
                return;
            }

            enqueueSnackbar(error, {
                variant: "error",
                hideIconVariant: true
            });

            setError('');
        }

        displayError().catch(console.error)

    }, [error]);

    const doList = async () => {
        try {
            enqueueSnackbar(
                'Confirm the transaction in your wallet to list',
                {
                    variant: "info",
                    hideIconVariant: true
                });

            await listNft(token, price, signer);

            setListModalOpen(false);
            setListedModalOpen(true);
            setLoading(true); // disable the outer button?
        } catch (e) {
            setLoading(false);
            setError(e.message);
        }
    }


    if (!address) {
        return null;
    }

    return (
        <>
            <TransactionModal modalOpen={boughtModalOpen} setModalOpen={setBoughtModalOpen} />
            <TransactionModal modalOpen={delistModalOpen} setModalOpen={setDelistModalOpen} />
            <TransactionModal modalOpen={listedModalOpen} setModalOpen={setListedModalOpen} />

            {/* List */}
            <ListModal
                listModalOpen={listModalOpen}
                setListModalOpen={setListModalOpen}
                setListedModalOpen={setListedModalOpen}
                price={price}
                setPrice={setPrice}
                token={token}
                doList={doList}
            />
            {
                mutableToken?.forSale && !isHodler() &&

                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <FormControl>
                        <div>
                            <Button
                                disabled={loading}
                                variant="contained"
                                sx={{ paddingY: 1.5, paddingX: 3 }}
                                onClick={async () => {
                                    try {
                                        setLoading(true);
                                        enqueueSnackbar(
                                            'Confirm the transaction in your wallet to buy',
                                            {
                                                variant: "info",
                                                hideIconVariant: true
                                            });

                                        await buyNft(token, mutableToken, signer);
                                        setBoughtModalOpen(true);
                                    } catch (e) {
                                        setLoading(false);
                                        setError(e.message)
                                    }
                                }}>
                                Buy NFT
                            </Button>
                        </div>
                        <FormHelperText sx={{ margin: 0, marginTop: 0.5 }}>Connected to Polygon and have Matic for gas?</FormHelperText>
                    </FormControl>
                </Box>

            }
            {
                mutableToken?.forSale && isHodler() &&
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <FormControl>
                        <div>
                            <Button
                                disabled={loading}
                                variant="contained"
                                sx={{ paddingY: 1.5, paddingX: 3 }}
                                onClick={async () => {
                                    try {
                                        setLoading(true);
                                        enqueueSnackbar(
                                            'Confirm the transaction in your wallet to delist',
                                            {
                                                variant: "info",
                                                hideIconVariant: true
                                            });

                                        await delistNft(token, signer);
                                        setDelistModalOpen(true);
                                    } catch (e) {
                                        setLoading(false);
                                        setError(e.message)
                                    }
                                }}>
                                Delist NFT
                            </Button>
                        </div>
                    </FormControl>
                    <FormHelperText sx={{ margin: 0, marginTop: 0.5 }}>Connected to Polygon and have Matic for gas?</FormHelperText>
                </Box>

            }
            {
                !mutableToken?.forSale && isHodler() &&
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <FormControl>
                        <div>
                            <Button
                                disabled={loading}
                                variant="contained"
                                sx={{ paddingY: 1.5, paddingX: 3 }}
                                onClick={() => {
                                    setLoading(true);
                                    setListModalOpen(true);
                                    setLoading(false);
                                }
                                }>
                                List NFT
                            </Button>
                        </div>
                    </FormControl>
                    <FormHelperText sx={{ margin: 0, marginTop: 0.5 }}>Connected to Polygon and have Matic for gas?</FormHelperText>
                </Box>
            }
        </>
    )
}
