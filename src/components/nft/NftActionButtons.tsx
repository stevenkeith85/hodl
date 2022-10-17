import { Button, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { WalletContext } from '../../contexts/WalletContext';
import { enqueueSnackbar } from 'notistack';
import { buyNft, delistNft } from "../../lib/nft";
import { ListModal } from "../modals/ListModal";
import { SuccessModal } from "../modals/SuccessModal";
import { Token } from "../../models/Token";
import { MutableToken } from "../../models/Nft";


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
                // @ts-ignore
                variant: "hodlsnackbar",
                type: "error"
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
                        color: theme => theme.palette.text.secondary
                    }}>
                    When your transaction has been confirmed on the blockchain, we&apos;ll update our database and send you a notification.
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
                        color: theme => theme.palette.text.secondary
                    }}>
                    When your transaction has been confirmed on the blockchain, we&apos;ll update our database and send you a notification.
                </Typography>
            </SuccessModal>


            {/* Delisted */}
            <SuccessModal
                modalOpen={delistModalOpen}
                setModalOpen={setDelistModalOpen}>
                <Typography
                    sx={{
                        fontSize: 16,
                        color: theme => theme.palette.text.secondary
                    }}>
                    When your transaction has been confirmed on the blockchain, we&apos;ll update our database and send you a notification.
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
                                        // @ts-ignore
                                        variant: "hodlsnackbar",
                                        type: "info"
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
                                        // @ts-ignore
                                        variant: "hodlsnackbar",
                                        type: "info"
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
