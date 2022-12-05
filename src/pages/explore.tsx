import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import useSWRInfinite from 'swr/infinite'
import { HodlLoadingSpinner } from '../components/HodlLoadingSpinner';
import { NftWindow } from '../components/NftWindow';
import { authenticate } from '../lib/jwt';
import { getTokenSearchResults } from './api/search/tokens';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { getAsString } from "../lib/getAsString";
import IconButton from '@mui/material/IconButton';
import { CloseIcon } from '../components/icons/CloseIcon';
import theme from '../theme';


const ForSaleFields = dynamic(
  () => import('../components/explore/ForSaleFields').then(mod => mod.ForSaleFields),
  {
    ssr: false,
    loading: () => null
  }
);

export async function getServerSideProps({ query, req, res }) {
  await authenticate(req, res);

  const page = query.page || 1;
  const limit = 9;
  const offset = (page - 1) * limit;

  console.log('query?.q', query?.q)
  const initalData = await getTokenSearchResults(
    query?.q || "",
    offset,
    limit,
    JSON.parse(query?.forSale || "false"),
    query?.minPrice || null,
    query?.maxPrice || null
  );

  let totalPages = Math.floor(Number(initalData?.total) / limit); // Number of full pages
  totalPages = (Number(initalData?.total) % limit !== 0) ? totalPages + 1 : totalPages; // add 1 if we have a partially filled page

  if (page > totalPages) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      address: req.address || null,
      q: query?.q || '',
      page,
      totalPages,
      limit,
      forSale: JSON.parse(query?.forSale || "false"),
      minPrice: query?.minPrice || null,
      maxPrice: query?.maxPrice || null,
      fallbackData: [initalData]
    },
  }
}

// components
export const NFTDetail = ({ nft }) => (
  <Box style={{
    margin: 8
  }}>
    <NftWindow nft={nft} />
  </Box>
)


// grid and loading screen
interface NFTGridProps {
  nfts: any[]
}
export const NFTGrid: React.FC<NFTGridProps> = ({ nfts }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          md: "1fr 1fr 1fr"
        },
        margin: -1,
      }}
    >
      {nfts?.map(nft => (
        <Link key={nft?.id} href={`/nft/${nft.id}`}>
          <NFTDetail nft={nft} />
        </Link>
      )
      )}
    </Box>
  )
}

const Footer = () => {
  return (
    <div
      style={{
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <HodlLoadingSpinner />
    </div>
  )
}

interface SearchProps {
  address: string,
  q: string,
  page: number,
  totalPages: number,
  limit: number,
  forSale: boolean,
  minPrice: number,
  maxPrice: number,
  fallbackData: { items: any[], next: number, total: number }[],
}

const Search: React.FC<SearchProps> = ({
  address,
  q,
  page,
  totalPages,
  limit,
  forSale,
  minPrice,
  maxPrice,
  fallbackData,
}) => {
  const title = "Explore Polygon NFTs on Hodl My Moon"
  const [forSaleChecked, setForSaleChecked] = useState(forSale);
  const [minPriceUI, setMinPriceUI] = useState(minPrice);
  const [maxPriceUI, setMaxPriceUI] = useState(maxPrice);

  const [searchQuery, setSearchQuery] = useState({
    q,
    forSale,
    minPrice,
    maxPrice,
  });

  const isOriginalSearchQuery = () => {
    return searchQuery.q === q && searchQuery.forSale === forSale && searchQuery.minPrice === minPrice && searchQuery.maxPrice === maxPrice;
  }

  const router = useRouter();

  const loadMore = () => {
    setSize(size => size + 1)
  }

  const getKey = (pageIndex, previousPageData) => {
    const offset = ((Number(page) + Number(pageIndex)) - 1) * Number(limit);

    if (offset > previousPageData?.total) {
      return null;
    }

    return `/api/search/tokens?q=${searchQuery?.q}&forSale=${searchQuery?.forSale}&offset=${offset}&limit=${Number(limit)}&minPrice=${searchQuery?.minPrice}&maxPrice=${searchQuery?.maxPrice}`                    // SWR key
  }

  const { data, error, isValidating, mutate, size, setSize } = useSWRInfinite(
    getKey,
    (key) => fetch(key, { keepalive: true }).then(response => response.json()),
    {
      revalidateFirstPage: false,
      revalidateOnMount: false,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      fallbackData: isOriginalSearchQuery() ? fallbackData : null
    }
  )

  useEffect(() => {
    if (isOriginalSearchQuery()) {
      return;
    }

    router.push(
      {
        pathname: '/explore',
        query: {
          q: searchQuery?.q,
          forSale: forSaleChecked, // the setState call won't have completed yet, so we'll need the value it WILL be set to
          minPrice: searchQuery?.minPrice,
          maxPrice: searchQuery?.maxPrice,
        }
      },
      undefined,
      {
        shallow: true
      }
    )
  }, [
    searchQuery.q,
    searchQuery.forSale,
    searchQuery.minPrice,
    searchQuery.maxPrice
  ]);

  useEffect(() => {

    if (!router?.query?.q) {
      return;
    }

    if (router?.query?.q === searchQuery?.q) {
      return;
    }

    if (isOriginalSearchQuery()) {
      return;
    }

    setSearchQuery(old => ({
      ...old,
      q: getAsString(router.query.q),
    }))

  }, [router.query.q]);

  const isEmpty = data?.[0]?.items?.length === 0;
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && data[size - 1]?.items?.length !== 0);
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.items?.length < limit);



  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="canonical" href={`/explore?page=${page}`} />
        {page < totalPages && <link rel="next" href={`/explore?page=${Number(page) + 1}`} />}
        {page > 1 && <link rel="prev" href={`/explore?page=${Number(page) - 1}`} />}
      </Head>
      <Box
        sx={{
          marginY: {
            xs: 1,
            md: 2
          },
        }}
      >
        <div>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              marginY: {
                xs: 2,
                md: 2
              },
              marginTop: {
                xs: 0,
              }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexGrow: 1,
                gap: 1,
                alignItems: 'center',
                justifyContent: { xs: 'space-between' },
              }}
            >
              <Box sx={{
                textAlign: "left"
              }}>
                <IconButton
                  onClick={e => {
                    setSearchQuery(old => ({
                      ...old,
                      q: '',
                      minPrice: null,
                      maxPrice: null
                    }))

                    setMinPriceUI(null);
                    setMaxPriceUI(null);
                  }}
                >
                  <CloseIcon
                    size={22}
                    fill={theme.palette.primary.main}
                  />
                </IconButton>
              </Box>
              {
                forSaleChecked &&
                <ForSaleFields
                  setSearchQuery={setSearchQuery}
                  minPriceUI={minPriceUI}
                  setMinPriceUI={setMinPriceUI}
                  maxPriceUI={maxPriceUI}
                  setMaxPriceUI={setMaxPriceUI}
                />
              }
              <Box sx={{ textAlign: 'right' }}>
                <Switch
                  checked={forSaleChecked}
                  onChange={(e) => {
                    setForSaleChecked(e.target.checked);
                    setSearchQuery(query => ({
                      ...query,
                      forSale: e.target.checked
                    }))
                  }
                  }
                />
              </Box>
            </Box>
          </Box>
        </div>
        <div>
          {data &&
            <Virtuoso
              useWindowScroll
              data={data}
              overscan={400}
              endReached={loadMore}
              itemContent={(index) => <NFTGrid nfts={data[index]?.items} />}
            />
          }
          {isLoadingMore && !isReachingEnd && <Footer />}
        </div>
      </Box>
    </>
  )
}

export default Search;