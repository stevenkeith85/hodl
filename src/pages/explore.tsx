import { Clear } from '@mui/icons-material';
import { Box, Chip, FormControlLabel, FormGroup, Switch, Tooltip, useMediaQuery, useTheme } from '@mui/material';
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
  const { q, forSale } = query;

  await authenticate(req, res);

  const limit = 11;
  const prefetchedResults = await getTokenSearchResults(q, 0, limit, JSON.parse(forSale || "false"));

  const tagsLimit = 4;
  const prefetchedTags = await getMostUsedTags(0, tagsLimit);

  return {
    props: {
      address: req.address || null,
      q: q || '',
      limit,
      tagsLimit,
      forSale: JSON.parse(forSale || "false"),
      fallbackData: [prefetchedResults],
      prefetchedTags
    },
  }
}


export default function Search({ q, limit, tagsLimit, forSale, fallbackData, prefetchedTags }) {
  const [forSaleToggle, setForSaleToggle] = useState(forSale);
  const [qChip, setQChip] = useState(q);

  const { results } = useSearchTokens(qChip, limit, forSaleToggle, qChip === q && forSale === forSaleToggle ? fallbackData : null);

  const router = useRouter();

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only('xs'));

  useEffect(() => {
    router.push(
      {
        pathname: '/explore',
        query: {
          q: qChip,
          forSale: forSaleToggle // the setState call won't have completed yet, so we'll need the value it WILL be set to
        }
      },
      undefined,
      {
        shallow: true
      }
    )
  }, [forSaleToggle, qChip]);

  useEffect(() => {
    setQChip(router.query.q)
  }, [router.query.q]);

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
            gap: 1,
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
                  setForSaleToggle(false);
                }}
              /></Tooltip>
            {!xs && <TagsPaginated limit={tagsLimit} selected={qChip} onClick={(value) => setQChip(value)} fallbackData={prefetchedTags}/>}
            <FormGroup>
              <Tooltip title="Only show for sale">
                <Switch
                  checked={forSaleToggle}
                  onChange={(e) => {
                    setForSaleToggle(old => !old);
                  }
                  }
                />
              </Tooltip>

            </FormGroup>
          </Box>

          {xs && <Box
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <TagsPaginated limit={tagsLimit} selected={qChip} onClick={(value) => setQChip(value)} fallbackData={prefetchedTags}/>
          </Box>}
        </Box>



        {results?.data?.[0]?.total === 0 &&
          <HodlImpactAlert message={"We can't find anything at the moment"} title="Sorry" />
        }
        <InfiniteScrollNftWindows swr={results} limit={limit} />
      </Box>
    </>
  )
}

