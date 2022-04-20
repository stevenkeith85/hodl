import { Stack } from "@mui/material";
import { useContext, useState } from "react";
import { buyNft, delistNft, listNftOnMarket } from "../../lib/nft";
import { WalletContext } from "../../pages/_app";
import { HodlButton } from "../HodlButton";
import SellIcon from '@mui/icons-material/Sell';
import { HodlModal, HodlTextField, RocketTitle, SuccessModal } from "../index";
import { useRouter } from "next/router";
import { useSnackbar } from 'notistack';


export const NftActionButtons = ({ nft }) => {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const { address } = useContext(WalletContext);

    const [listModalOpen, setListModalOpen] = useState(false);
    const [delistModalOpen, setDelistModalOpen] = useState(false);
    const [listedModalOpen, setListedModalOpen] = useState(false);
    const [boughtModalOpen, setBoughtModalOpen] = useState(false);

    const [price, setPrice] = useState(null);

    const isOwner = () => Boolean(nft?.owner?.toLowerCase() === address?.toLowerCase());

    const smartContractError = e => {
        const re = /reverted with reason string '(.+)'/gi;
        const matches = re.exec(e.data.message)
    
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
            <HodlModal
                open={listModalOpen}
                setOpen={setListModalOpen}
            >
                <Stack spacing={6}>
                    <RocketTitle 
                        title="List this token on the market" 
                    />
                    <HodlTextField
                        label="Price (Matic)"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    <HodlButton
                        onClick={async () => {
                            try {
                                enqueueSnackbar('Please Approve Transaction in Wallet', { variant: "info" });
                                await listNftOnMarket(router.query.tokenId, price);
                                enqueueSnackbar('Token listed on market', { variant: "success" });
                                setListModalOpen(false);
                                setListedModalOpen(true);
                            } catch (e) {
                                if (e.code === -32603) {
                                    smartContractError(e);
                                }
                            }
                        }}
                        disabled={!price}
                    >
                        Add
                    </HodlButton>
                </Stack>
            </HodlModal>

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
                        <HodlButton
                            startIcon={<SellIcon fontSize="large" />}
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
                        </HodlButton>
                    }
                    {isOwner() &&
                        <>
                            {
                                nft?.forSale ? (
                                    <HodlButton
                                        startIcon={<SellIcon fontSize="large" />}
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
                                    </HodlButton>
                                ) : (
                                    <HodlButton
                                        startIcon={<SellIcon fontSize="large" />}
                                        onClick={() => setListModalOpen(true)}>
                                        List NFT
                                    </HodlButton>
                                )
                            }
                        </>
                    }
                </Stack>
            </Stack>
        </>
    )
}
