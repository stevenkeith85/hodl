import { Box } from "@mui/material";
import InfiniteScroll from "react-swr-infinite-scroll";
import { SWRInfiniteResponse } from "swr/infinite/dist/infinite";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import { Likes } from "../Likes";
import { TokenLink } from "../token/TokenLink";
import { Token } from '../../models/Token';

interface TokenLinksListProps {
  swr: SWRInfiniteResponse<any, any>;
  limit: number;
  width?: string
  showLikes?: boolean;
}

export const TokenLinksList: React.FC<TokenLinksListProps> = ({ swr, limit, showLikes = true }) => {

  if (swr?.data && swr?.data[0]?.items?.length === 0) {
    return null;
  }

  return (
    <>
      {swr.data &&
        <Box
          display="flex"
          gap={2}
          flexDirection={"column"}
          marginBottom={-2}
        >
          <InfiniteScroll
            swr={swr}
            loadingIndicator={<HodlLoadingSpinner />}
            isReachingEnd={following =>
              !following.data[0].items.length ||
              following.data[following.data.length - 1]?.items.length < limit
            }
          >
            {
              ({ items }) => items.map((token : Token) => 
                <Box display="flex" width={`100%`} alignItems="center" key={token.id}>
                  <Box flexGrow={1}>
                    <TokenLink token={token} />
                  </Box>
                  {showLikes && <Box flexShrink={1}>
                    <Likes id={token.id} object="token" />
                  </Box>
                  }
                </Box>
              )
            }
          </InfiniteScroll>
        </Box>
      }
    </>)
}