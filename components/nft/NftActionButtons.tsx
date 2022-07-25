import { Button, Stack } from "@mui/material";
import { useContext, useState } from "react";
import { buyNft, delistNft } from "../../lib/nft";
import { WalletContext } from '../../contexts/WalletContext';
import { SuccessModal } from "../index";
import { useSnackbar } from 'notistack';
import { ListModal } from "../modals/ListModal";



export const NftActionButtons = ({ nft }) => {
    const { enqueueSnackbar } = useSnackbar();
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
            enqueueSnackbar(matches[1], { variant: "error" });
        }
    }

    return (
        <>
            {/* Bought */}
            <SuccessModal
                modalOpen={boughtModalOpen}
                setModalOpen={setBoughtModalOpen}
                message="You&apos;ve successfully bought a token on the market"
                tab={0}
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
                message="You&apos;ve successfully listed your token on the market"
                tab={1}
            />

            {/* Delisted */}
            <SuccessModal
                modalOpen={delistModalOpen}
                setModalOpen={setDelistModalOpen}
                message="You&apos;ve successfully delisted your token from the market"
                tab={0}
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
                                    enqueueSnackbar('Please Approve Transaction in Wallet', { variant: "info" });
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
                                                enqueueSnackbar('Please Approve Transaction in Wallet', { variant: "info" });
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
