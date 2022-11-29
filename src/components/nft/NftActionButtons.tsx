import { Button, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { WalletContext } from '../../contexts/WalletContext';
import { enqueueSnackbar } from 'notistack';
import { buyNft, delistNft } from "../../lib/nft";
import { ListModal } from "../modals/ListModal";
import { SuccessModal } from "../modals/SuccessModal";
import { Token } from "../../models/Token";
import { MutableToken } from "../../models/MutableToken";


interface NftActionButtons {
    token: Token;
    mutableToken: MutableToken
}

export const NftActionButtons = ({
    token,
    mutableToken }) => {
    const { address } = useContext(WalletContext);

    const [listModalOpen, setListModalOpen] = useState(false);
    const [delistModalOpen, setDelistModalOpen] = useState(false);
    const [listedModalOpen, setListedModalOpen] = useState(false);
    const [boughtModalOpen, setBoughtModalOpen] = useState(false);

    const [price, setPrice] = useState(null);

    const isHodler = () => Boolean(mutableToken?.hodler?.toLowerCase() === address?.toLowerCase());

    const smartContractError = e => {
        enqueueSnackbar(
            e?.data?.message,
            {
                variant: "error",
                hideIconVariant: true
            });
    }

    if (!address) {
        return null;
    }

    return (
        <>
            {/* Bought */}
            <SuccessModal
                modalOpen={boughtModalOpen}
                setModalOpen={setBoughtModalOpen}>
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
            </SuccessModal>

            {/* List */}
            <ListModal
                listModalOpen={listModalOpen}
                setListModalOpen={setListModalOpen}
                setListedModalOpen={setListedModalOpen}
                price={price}
                setPrice={setPrice}
                token={token}
            />

            {/* Listed */}
            <SuccessModal
                modalOpen={listedModalOpen}
                setModalOpen={setListedModalOpen}>
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
            </SuccessModal>


            {/* Delisted */}
            <SuccessModal
                modalOpen={delistModalOpen}
                setModalOpen={setDelistModalOpen}>
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
            </SuccessModal>
            {
                mutableToken?.forSale && !isHodler() &&
                <div>
                    <Button
                        variant="contained"
                        sx={{ paddingY: 1.5, paddingX: 3 }}
                        onClick={async () => {
                            try {
                                enqueueSnackbar(
                                    'Please confirm the transaction in Metamask',
                                    {
                                        variant: "info",
                                        hideIconVariant: true
                                    });
                                await buyNft(token, mutableToken);
                                setBoughtModalOpen(true);
                            } catch (e) {
                                if (e.code === -32603) {
                                    smartContractError(e);
                                }
                            }
                        }}>
                        Buy NFT
                    </Button>
                </div>
            }
            {
                mutableToken?.forSale && isHodler() &&
                <div>
                    <Button
                        variant="contained"
                        sx={{ paddingY: 1.5, paddingX: 3 }}
                        onClick={async () => {
                            try {
                                enqueueSnackbar(
                                    'Please confirm the transaction in MetaMask',
                                    {
                                        variant: "info",
                                        hideIconVariant: true
                                    });

                                await delistNft(token);
                                setDelistModalOpen(true);
                            } catch (e) {
                                if (e.code === -32603) {
                                    smartContractError(e);
                                }
                            }
                        }}>
                        Delist NFT
                    </Button>
                </div>
            }
            {
                !mutableToken?.forSale && isHodler() &&
                <div>
                    <Button
                        variant="contained"
                        sx={{ paddingY: 1.5, paddingX: 3 }}
                        onClick={() => setListModalOpen(true)}>
                        List NFT
                    </Button>
                </div>
            }
        </>
    )
}
