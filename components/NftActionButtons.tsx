import { Stack } from "@mui/material";
import { useContext, useRef, useState } from "react";
import { buyNft, delistNft, listTokenOnMarket } from "../lib/nft";
import { checkForAndDisplaySmartContractErrors } from "../lib/utils";
import { WalletContext } from "../pages/_app";
import { HodlButton } from "./HodlButton";
import { SocialShare } from "./SocialShare";
import SellIcon from '@mui/icons-material/Sell';
import { HodlModal, HodlSnackbar, HodlTextField, RocketTitle, SuccessModal } from "./index";
import { useRouter } from "next/router";


export const NftActionButtons = ({ nft }) => {
    const router = useRouter();
    const snackbarRef = useRef();
    const { address } = useContext(WalletContext);

    const [listModalOpen, setListModalOpen] = useState(false);
    const [delistModalOpen, setDelistModalOpen] = useState(false);
    const [listedModalOpen, setListedModalOpen] = useState(false);
    const [boughtModalOpen, setBoughtModalOpen] = useState(false);

    const [price, setPrice] = useState(null);

    const isOwner = () => Boolean(nft?.owner?.toLowerCase() === address?.toLowerCase());

    return (
        <>
            <HodlSnackbar ref={snackbarRef} />

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
                                // @ts-ignore
                                snackbarRef?.current?.display('Please Approve Transaction in Wallet', 'info');
                                await listTokenOnMarket(router.query.tokenId, price);
                                // @ts-ignore
                                snackbarRef?.current?.display('Token listed on market', 'success');
                                setListModalOpen(false);
                                setListedModalOpen(true);
                            } catch (e) {
                                checkForAndDisplaySmartContractErrors(e, snackbarRef);
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
                        Boolean(nft?.forSale) && !isOwner() &&
                        <HodlButton
                            startIcon={<SellIcon fontSize="large" />}
                            onClick={async () => {
                                try {
                                    // @ts-ignore
                                    snackbarRef?.current?.display('Please Approve Transaction in Wallet', 'info');
                                    await buyNft(nft);
                                    setBoughtModalOpen(true);
                                } catch (e) {
                                    checkForAndDisplaySmartContractErrors(e, snackbarRef);
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
                                                // @ts-ignore
                                                snackbarRef?.current?.display('Please Approve Transaction in Wallet', 'info');
                                                await delistNft(nft);
                                                setDelistModalOpen(true);
                                            } catch (e) {
                                                checkForAndDisplaySmartContractErrors(e, snackbarRef);
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
                <SocialShare />
            </Stack>
        </>
    )
}
