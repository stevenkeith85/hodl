import { Clear } from '@mui/icons-material';
import { Box, FormGroup, InputAdornment, Switch, TextField, Tooltip, Typography } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { HodlImpactAlert } from '../components/HodlImpactAlert';
import { InfiniteScrollNftWindows } from '../components/InfiniteScrollNftWindows';
import { MaticSymbol } from '../components/MaticSymbol';
import { useSearchTokens } from '../hooks/useSearchTokens';
import { authenticate } from '../lib/jwt';
import { getTokenSearchResults } from './api/search/tokens';


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
        <title>Explore · Hodl My Moon</title>
      </Head>
      <Box
        sx={{
          marginY: {
            xs: 2,
            sm: 4
          }
        }}
      >
        <Box
          sx={{
          }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              marginY: {
                xs: 2,
                sm: 4
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
                <Tooltip title="Clear filters">
                  <Clear
                    fontSize="small"
                    sx={{
                      cursor: 'pointer'
                    }}
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
                  /></Tooltip>
              </Box>

              {forSaleToggle && <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '70%'
                }}>

                <TextField
                  sx={{
                    maxWidth: `40%`
                  }}
                  onKeyPress={(e) => {
                    if (e.key == "Enter") {
                      setSearchQ(old => ({
                        ...old,
                        minPrice: minPriceUI,
                      }))
                    }
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">
                      <MaticSymbol />
                    </InputAdornment>,
                  }}
                  size="small"
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  value={minPriceUI}
                  onChange={e => setMinPriceUI(e.target.value)}
                />
                <Typography
                  component="span"
                >
                  to
                </Typography>

                <TextField
                  sx={{
                    maxWidth: `40%`
                  }}
                  onKeyPress={(e) => {
                    if (e.key == "Enter") {
                      setSearchQ(old => ({
                        ...old,
                        maxPrice: maxPriceUI,
                      }))
                    }
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">
                      <MaticSymbol />
                    </InputAdornment>,
                  }}
                  size="small"
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  value={maxPriceUI}
                  onChange={e => setMaxPriceUI(e.target.value)}
                />
              </Box>
              }
              <Box
                sx={{
                  width: '15%',
                  display: 'flex',
                  justifyContent: 'end'
                }}
              >
                <FormGroup>
                  <Tooltip title="For Sale">
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
                  </Tooltip>
                </FormGroup>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box>
          {!results.isValidating && results.data && results.data[0] && results.data[0].total === 0 &&
            <HodlImpactAlert message={"We can't find anything at the moment"} title="Sorry" />
          }
          <InfiniteScrollNftWindows swr={results} limit={limit} pattern={false} />
        </Box>
      </Box>
    </>
  )
}

