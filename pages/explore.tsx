import { Box, Chip, FormControlLabel, FormGroup, Switch } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import InfiniteScroll from 'react-swr-infinite-scroll';
import { HodlImpactAlert } from '../components/HodlImpactAlert';
import { HodlLoadingSpinner } from '../components/HodlLoadingSpinner';
import { InfiniteScrollNftWindows } from '../components/InfiniteScrollNftWindows';
import { TagsPaginated } from '../components/TagsPaginated';
import { RankingsContext } from '../contexts/RankingsContext';
import { useRankings } from '../hooks/useRankings';
import { useSearchTokens } from '../hooks/useSearchTokens';
import { authenticate } from '../lib/jwt';
import { getTokenSearchResults } from './api/search/tokens';


export async function getServerSideProps({ query, req, res }) {
  const { q, forSale } = query;

  await authenticate(req, res);

  const limit = 14;
  const prefetchedResults = await getTokenSearchResults(q, 0, limit, JSON.parse(forSale || "false"));

  console.log('JSON.parse(forSale || "false")', JSON.parse(forSale || "false"))
  return {
    props: {
      address: req.address || null,
      q: q || '',
      limit,
      forSale: JSON.parse(forSale || "false"),
      fallbackData: [prefetchedResults]
    },
  }
}


export default function Search({ q, limit, forSale, fallbackData }) {


  const [forSaleToggle, setForSaleToggle] = useState(forSale);
  const [qChip, setQChip] = useState(q);

  const { results } = useSearchTokens(qChip, limit, forSaleToggle, qChip === q && forSale === forSaleToggle ? fallbackData : null);

  const router = useRouter();

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
          marginBottom: 2
        }}>

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexGrow: 1,
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginY: 4

          }}
        >
          <Chip
            color={qChip === '' ? 'secondary' : 'default'}
            variant={qChip === '' ? 'filled' : 'outlined'}
            label={'clear'}
            onClick={e => {
              setQChip('');
              setForSaleToggle(false);
            }} ></Chip>
          <TagsPaginated onClick={(value) => setQChip(value)} />

          <FormGroup>
            <FormControlLabel sx={{ width: 'max-content', }} control={
              <Switch
                checked={forSaleToggle}
                onChange={(e) => {
                  setForSaleToggle(old => !old);
                }
                } />}
              label="for sale" />
          </FormGroup>

        </Box>


        {results?.data?.[0]?.total === 0 &&
          <HodlImpactAlert message={"We can't find anything at the moment"} title="Sorry" />
        }
        <InfiniteScrollNftWindows swr={results} limit={limit} />
      </Box>
    </>
  )
}

