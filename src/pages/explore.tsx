import { useEffect, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';

import { HodlImpactAlert } from '../components/HodlImpactAlert';
import { useSearchTokens } from '../hooks/useSearchTokens';

import { authenticate } from '../lib/jwt';
import { getTokenSearchResults } from './api/search/tokens';
import theme from '../theme';

import { CloseIcon } from '../components/icons/CloseIcon';

const ForSaleFields = dynamic(
  () => import('../components/explore/ForSaleFields').then(mod => mod.ForSaleFields),
  {
    ssr: false,
    loading: () => null
  }
);

const InfiniteScrollNftWindows = dynamic(
  () => import('../components/InfiniteScrollNftWindows').then((module) => module.InfiniteScrollNftWindows),
  {
    ssr: false,
    loading: () => null
  }
);


export async function getServerSideProps({ query, req, res }) {
  let { q, forSale, minPrice, maxPrice } = query;

  await authenticate(req, res);

  const limit = 11;

  const prefetchedResults = await getTokenSearchResults(
    q,
    0,
    limit,
    JSON.parse(forSale || "false"),
    minPrice,
    maxPrice
  );

  return {
    props: {
      address: req.address || null,
      q: q || '',
      limit,
      forSale: JSON.parse(forSale || "false"),
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
      fallbackData: [prefetchedResults],
    },
  }
}


export default function Search({
  q,
  limit,
  forSale,
  minPrice,
  maxPrice,
  fallbackData,
}) {
  const title = "NFT Art - Explore Polygon NFTs"
  const [qChip, setQChip] = useState(q);
  const [forSaleToggle, setForSaleToggle] = useState(forSale);
  const [minPriceUI, setMinPriceUI] = useState(minPrice);
  const [maxPriceUI, setMaxPriceUI] = useState(maxPrice);

  const [searchQ, setSearchQ] = useState({
    q,
    limit,
    forSale,
    minPrice,
    maxPrice
  });


  const isOriginalSearchQuery = () => {
    return searchQ.q === q &&
      searchQ.limit === limit &&
      searchQ.forSale === forSale &&
      searchQ.minPrice === minPrice &&
      searchQ.maxPrice === maxPrice;
  }

  const { results } = useSearchTokens(
    searchQ,
    isOriginalSearchQuery() ? fallbackData : null
  );

  const router = useRouter();

  useEffect(() => {

    if (!router.query.q) {
      return;
    }

    setQChip(router.query.q);
    setSearchQ(old => ({
      ...old,
      q: router.query.q,
    }))

  }, [router.query.q]);

  // update the url when a search happens
  // TODO: Check if the search query is the original search query, and early return. (to keep the url pretty)
  useEffect(() => {

    if (isOriginalSearchQuery()) {
      return;
    }

    router.push(
      {
        pathname: '/explore',
        query: {
          q: qChip,
          forSale: forSaleToggle, // the setState call won't have completed yet, so we'll need the value it WILL be set to
          minPrice: minPriceUI,
          maxPrice: maxPriceUI
        }
      },
      undefined,
      {
        shallow: true
      }
    )
  }, [
    searchQ.q,
    searchQ.limit,
    searchQ.forSale,
    searchQ.minPrice,
    searchQ.maxPrice
  ]);

  return (
    <>
      <Head>
        <title>{title}</title>
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
                gap: 4,
                alignItems: 'center',
                justifyContent: { xs: 'space-between' },
              }}
            >
              <Box
                sx={{
                  width: '15%',
                  display: 'flex',
                  justifyContent: 'start'
                }}
              >
                <IconButton
                  onClick={e => {
                    setQChip('');
                    setMinPriceUI('');
                    setMaxPriceUI('');

                    setSearchQ(old => ({
                      ...old,
                      q: '',
                      minPrice: null,
                      maxPrice: null
                    }))
                  }}
                >
                  <CloseIcon
                    size={22}
                    fill={theme.palette.primary.main}
                  />
                </IconButton>
              </Box>

              {forSaleToggle && <ForSaleFields
                setSearchQ={setSearchQ}
                minPriceUI={minPriceUI}
                setMinPriceUI={setMinPriceUI}
                maxPriceUI={maxPriceUI}
                setMaxPriceUI={setMaxPriceUI}
              />
              }
              <Box
                sx={{
                  width: '15%',
                  display: 'flex',
                  justifyContent: 'end'
                }}
              >
                <Switch
                  checked={forSaleToggle}
                  onChange={(e) => {
                    setForSaleToggle(old => !old);
                    setSearchQ(old => ({
                      ...old,
                      forSale: !old.forSale
                    }))
                  }
                  }
                />
              </Box>
            </Box>
          </Box>
        </div>
        <div>
          {!results.isValidating && results.data && results.data[0] && results.data[0].total === 0 &&
            <HodlImpactAlert message={"We can't find anything at the moment"} title="Sorry" />
          }
          <InfiniteScrollNftWindows swr={results} limit={limit} pattern={false} />
        </div>
      </Box>
    </>
  )
}
