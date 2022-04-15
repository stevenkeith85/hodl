import { Stack } from "@mui/material";
import { InfiniteScroll } from "../InfiniteScroll";
import NftList from "../NftList";

interface ListedTabProps {
  profileAddress: string,
  prefetchedData?: []
}

export const ListedTab: React.FC<ListedTabProps> = ({ profileAddress, prefetchedData = null }) => {
  return (
    <Stack spacing={4} >
      {
        <InfiniteScroll
          fetcher={
            async (offset, limit) => await fetch(`/api/profile/listed?address=${profileAddress}&offset=${offset}&limit=${limit}`)
              .then(r => r.json())
              .then(json => json.data)
          }
          swrkey={'marketNfts: ' + profileAddress}
          prefetchedData={prefetchedData}
          //revalidateOnMount={prefetchedData ? false : true}
          render={nfts => (
            <NftList
              nfts={nfts}
              showName={true}
              showAvatar={false}
            />
          )}
        />
      }
    </Stack>
  )
}