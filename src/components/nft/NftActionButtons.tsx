import { Button, Stack, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { WalletContext } from '../../contexts/WalletContext';
import { enqueueSnackbar } from 'notistack';
import { buyNft, delistNft } from "../../lib/nft";
import { ListModal } from "../modals/ListModal";
import { SuccessModal } from "../modals/SuccessModal";
import { Token } from "../../models/Token";


interface NftActionButtons {
    nft: Token;
    owner: string;
    listed: boolean;
}

export const NftActionButtons = ({ nft, owner, listed }) => {
    const { address } = useContext(WalletContext);

    const [listModalOpen, setListModalOpen] = useState(false);
    const [delistModalOpen, setDelistModalOpen] = useState(false);
    const [listedModalOpen, setListedModalOpen] = useState(false);
    const [boughtModalOpen, setBoughtModalOpen] = useState(false);

    const [price, setPrice] = useState(null);

    const isOwner = () => Boolean(owner?.toLowerCase() === address?.toLowerCase());

    const smartContractError = e => {
        const re = /reverted with reason string '(.+)'/gi;
        const matches = re.exec(e?.data?.message)

        if (matches) {
            enqueueSnackbar(
                matches[1],
                {
                    // @ts-ignore
                    variant: "hodlsnackbar",
                    type: "error"
                });
        }
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
                listed && !isOwner() &&
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

                                await buyNft(nft);
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
                listed && isOwner() &&
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

                                await delistNft(nft);
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
                !listed && isOwner() &&
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
