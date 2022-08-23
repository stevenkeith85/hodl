import { Button, Stack } from "@mui/material";
import { useContext, useState } from "react";
import { WalletContext } from '../../contexts/WalletContext';
import { enqueueSnackbar } from 'notistack';
import { buyNft, delistNft } from "../../lib/nft";
import { ListModal } from "../modals/ListModal";
import { SuccessModal } from "../modals/SuccessModal";


export const NftActionButtons = ({ nft }) => {
    const { address } = useContext(WalletContext);

    const [listModalOpen, setListModalOpen] = useState(false);
    const [delistModalOpen, setDelistModalOpen] = useState(false);
    const [listedModalOpen, setListedModalOpen] = useState(false);
    const [boughtModalOpen, setBoughtModalOpen] = useState(false);

    const [price, setPrice] = useState(null);

    const isOwner = () => Boolean(nft?.owner?.toLowerCase() === address?.toLowerCase());

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

    return (
        <>
            {/* Bought */}
            <SuccessModal
                modalOpen={boughtModalOpen}
                setModalOpen={setBoughtModalOpen}
                message="When your purchase has been confirmed on the blockchain, we'll send you a notification. This should not take long"
            />

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
                setModalOpen={setListedModalOpen}
                message="When your listing has been confirmed on the blockchain, we'll send you a notification. This should not take long"
            />

            {/* Delisted */}
            <SuccessModal
                modalOpen={delistModalOpen}
                setModalOpen={setDelistModalOpen}
                message="When your delisting has been confirmed on the blockchain, we'll send you a notification. This should not take long"
            />

            <Stack
                direction="row"
                sx={{
                    justifyContent: "space-between",
                    alignItems: 'center'
                }}>
                <Stack
                    direction="row"
                    spacing={2}
                >
                    {
                        Boolean(address) && Boolean(nft?.forSale) && !isOwner() &&
                        <Button
                            variant="contained"
                            sx={{ paddingY: 1.5, paddingX: 3 }}
                            onClick={async () => {
                                try {
                                    enqueueSnackbar(
                                        'Please approve the transaction in Metamask',
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
                    }
                    {isOwner() &&
                        <>
                            {
                                nft?.forSale ? (
                                    <Button
                                        variant="contained"
                                        sx={{ paddingY: 1.5, paddingX: 3 }}
                                        onClick={async () => {
                                            try {
                                                enqueueSnackbar(
                                                    'Please approve the transaction in Metamask',
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
                                ) : (
                                    <Button
                                        variant="contained"
                                        sx={{ paddingY: 1.5, paddingX: 3 }}
                                        onClick={() => setListModalOpen(true)}>
                                        List NFT
                                    </Button>
                                )
                            }
                        </>
                    }
                </Stack>
            </Stack>
        </>
    )
}
