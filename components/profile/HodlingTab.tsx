import { Stack } from "@mui/material";
import { InfiniteScroll } from "../InfiniteScroll";

interface HodlingTabProps {
    profileAddress: string,
    prefetchedData?: []
}

export const HodlingTab: React.FC<HodlingTabProps> = ({ profileAddress, prefetchedData=null }) => {
    return (
        <Stack spacing={4}>
            <InfiniteScroll
                fetcher={
                    async (offset, limit) => await fetch(`/api/profile/hodling?address=${profileAddress}&offset=${offset}&limit=${limit}`)
                                                    .then(r => r.json())
                                                    .then(json => json.data)
                }
                swrkey={'walletNfts: ' + profileAddress}
                prefetchedData={prefetchedData}
                //revalidateOnMount={prefetchedData ? false : true}
                viewSale={false}
                showAvatar={false} 
                />
        </Stack>
    )
}