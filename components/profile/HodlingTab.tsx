import { Stack } from "@mui/material";
import { InfiniteScroll } from "../InfiniteScroll";
import NftList from "../NftList";

interface HodlingTabProps {
    profileAddress: string,
    prefetchedData?: []
}

export const HodlingTab: React.FC<HodlingTabProps> = ({ profileAddress, prefetchedData = null }) => {
    return (
        <Stack spacing={4}>
            <InfiniteScroll
                swrkey={'walletNfts: ' + profileAddress}
                fetcher={
                    async (offset, limit) => await fetch(`/api/profile/hodling?address=${profileAddress}&offset=${offset}&limit=${limit}`)
                        .then(r => r.json())
                        .then(json => json.data)
                }
                prefetchedData={prefetchedData}
                revalidateOnMount={true}
                render={nfts => (
                    <NftList
                        nfts={nfts}
                        viewSale={false}
                        showAvatar={false}
                    />
                )}
            />
        </Stack>
    )
}