import { Stack } from "@mui/material";
import { InfiniteScroll } from "../InfiniteScroll";

interface ListedTabProps {
  profileAddress: string,
  prefetchedData?: []
}

export const ListedTab: React.FC<ListedTabProps> = ({ profileAddress, prefetchedData=null }) => {
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
            showName={true}
            showAvatar={false}
            //revalidateOnMount={prefetchedData ? false : true}
            />
          }
        </Stack>
    )
}