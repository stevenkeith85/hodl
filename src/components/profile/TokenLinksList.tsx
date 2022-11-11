import { SWRInfiniteResponse } from "swr/infinite/dist/infinite";
import dynamic from 'next/dynamic';
import InfiniteScroll from "react-swr-infinite-scroll";

import { HodlLoadingSpinner } from "../HodlLoadingSpinner";

import { TokenLink } from "../token/TokenLink";
import { Token } from '../../models/Token';
import theme from "../../theme";


const Likes = dynamic(
  () => import('../Likes').then(mod => mod.Likes),
  {
      ssr: false,
      loading: () => null
  }
);


interface TokenLinksListProps {
  swr: SWRInfiniteResponse<any, any>;
  limit: number;
  width?: string
  showLikes?: boolean;
  size?: number;
  fontSize?: number;
}

export const TokenLinksList: React.FC<TokenLinksListProps> = ({ swr, limit, showLikes = true, size = 44, fontSize = 14 }) => {
  return (
    <>
      {swr.data &&
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          <InfiniteScroll
            swr={swr}
            loadingIndicator={<HodlLoadingSpinner sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 1 }} />}
            isReachingEnd={swr => {
              return swr.data?.[0]?.items?.length == 0 ||
                swr.data?.[swr.data?.length - 1]?.items?.length < limit
            }
            }
          >
            {
              ({ items }) => items?.map((token: Token) =>
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    margin: `${theme.spacing(1.5)} 0`
                  }}

                  key={token.id}
                >
                  <div
                    style={{
                      flexGrow: 1
                    }}>
                    <TokenLink token={token} size={size} fontSize={fontSize} />
                  </div>
                  {showLikes && <div
                    style={{
                      flexShrink: 1
                    }}>
                    <Likes
                      id={token.id}
                      object="token"
                      size={18}
                      fontSize={12}
                    />
                  </div>
                  }
                </div>
              )
            }
          </InfiniteScroll>
        </div>
      }
    </>)
}