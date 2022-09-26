import { Clear, HorizontalRule } from '@mui/icons-material';
import { Box, Button, Chip, FormControlLabel, FormGroup, InputAdornment, Slider, Switch, TextField, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Form } from 'formik';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { HodlImpactAlert } from '../components/HodlImpactAlert';
import { InfiniteScrollNftWindows } from '../components/InfiniteScrollNftWindows';
import { TagsPaginated } from '../components/TagsPaginated';
import { useSearchTokens } from '../hooks/useSearchTokens';
import { authenticate } from '../lib/jwt';
import { getMostUsedTags } from './api/rankings/tag';
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

  const tagsLimit = 4;
  const prefetchedTags = await getMostUsedTags(0, tagsLimit);

  return {
    props: {
      address: req.address || null,
      q: q || '',
      limit,
      tagsLimit,
      forSale: JSON.parse(forSale || "false"),
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
      fallbackData: [prefetchedResults],
      prefetchedTags
    },
  }
}


export default function Search({
  q,
  limit,
  tagsLimit,
  forSale,
  minPrice,
  maxPrice,
  fallbackData,
  prefetchedTags
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

  const { results } = useSearchTokens(searchQ,
    qChip === q && forSaleToggle === forSale ?
      fallbackData :
      null
  );

  const router = useRouter();

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only('xs'));

  useEffect(() => {
    setQChip(router.query.q);
    setSearchQ(old => ({
      ...old,
      q: router.query.q,
    }))
  }, [router.query.q]);

  // update the url when a search happens
  useEffect(() => {
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
          marginBottom: 2,
        }}>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            marginY: 4
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
            {
              !xs &&
              <TagsPaginated
                limit={tagsLimit}
                selected={qChip}
                onClick={
                  (value) => {
                    if (value == qChip) {
                      setQChip('');
                      setSearchQ(old => ({
                        ...old,
                        q: '',
                      }))
                    } else {
                      setQChip(value);
                      setSearchQ(old => ({
                        ...old,
                        q: value,
                      }))
                    }

                  }
                }
                fallbackData={prefetchedTags}
              />}
            <FormGroup>
              <Tooltip title="On The Market">
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

          {
            xs && <Box
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <TagsPaginated
                limit={tagsLimit}
                selected={qChip}
                onClick={
                  (value) => {
                    if (value == qChip) {
                      setQChip('');
                      setSearchQ(old => ({
                        ...old,
                        q: '',
                      }))
                    } else {
                      setQChip(value);
                      setSearchQ(old => ({
                        ...old,
                        q: value,
                      }))
                    }

                  }
                }
                fallbackData={prefetchedTags}
              />
            </Box>
          }
          { forSaleToggle && <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}>

            <TextField
            sx={{ width: 125}}
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
                  <Typography
                    component="span"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      margin: 0,
                      padding: 0,
                      verticalAlign: 'bottom',
                      gap: 0.5,
                      'img': {
                        filter: 'brightness(0) saturate(100%) invert(0) sepia(0%) saturate(0%) hue-rotate(242deg) brightness(115%) contrast(101%)'
                      },
                    }}>
                    <img src="/matic.svg" width={12} height={12} alt="matic symbol" />
                  </Typography>
                </InputAdornment>,
              }}
              size="small"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              value={minPriceUI}
              onChange={e => setMinPriceUI(e.target.value)}
            />
            to
            <TextField
            sx={{ width: 125}}
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
                  <Typography
                    component="span"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      margin: 0,
                      padding: 0,
                      verticalAlign: 'bottom',
                      gap: 0.5,
                      'img': {
                        filter: 'brightness(0) saturate(100%) invert(0) sepia(0%) saturate(0%) hue-rotate(242deg) brightness(115%) contrast(101%)'
                      },
                    }}>
                    <img src="/matic.svg" width={12} height={12} alt="matic symbol" />
                  </Typography>
                </InputAdornment>,
              }}
              size="small"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              value={maxPriceUI}
              onChange={e => setMaxPriceUI(e.target.value)}
            />
          </Box>}
        </Box>
        {results?.data?.[0]?.total === 0 &&
          <HodlImpactAlert message={"We can't find anything at the moment"} title="Sorry" />
        }
        <InfiniteScrollNftWindows swr={results} limit={limit} pattern={false} />
      </Box>
    </>
  )
}

