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
  size?: number;
  fontSize?: number;
}

export const TokenLinksList: React.FC<TokenLinksListProps> = ({ swr, limit, showLikes = true, size=44, fontSize=14 }) => {
  return (
    <>
      {swr.data &&
        <Box
          display="flex"
          flexDirection={"column"}
          sx={{width: '100%'}}
        >
          <InfiniteScroll
            swr={swr}
            loadingIndicator={<HodlLoadingSpinner />}
            isReachingEnd={swr => {
              return swr.data?.[0]?.items?.length == 0 || 
                      swr.data?.[swr.data?.length - 1]?.items?.length < limit
            }
            }
          >
            {
              ({ items }) => items.map((token : Token) => 
                <Box 
                  display="flex" 
                  width={`100%`} 
                  alignItems="center" 
                  key={token.id}
                  sx={{
                    marginY: 2
                  }}
                >
                  <Box flexGrow={1}>
                    <TokenLink token={token} size={size} fontSize={fontSize}/>
                  </Box>
                  {showLikes && <Box flexShrink={1}>
                    <Likes 
                      id={token.id} 
                      object="token" 
                      size={18}  
                      fontSize={12}
                    />
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