import { Box, Chip, FormControlLabel, FormGroup, Switch } from '@mui/material';
import Head from 'next/head';
import { useState } from 'react';
import { HodlImpactAlert } from '../components/HodlImpactAlert';
import { InfiniteScrollNftWindows } from '../components/InfiniteScrollNftWindows';
import { useSearchTokens } from '../hooks/useSearchTokens';
import { authenticate } from '../lib/jwt';
import { getTokenSearchResults } from './api/search/tokens';


export async function getServerSideProps({ query, req, res }) {
  const { q, forSale } = query;

  await authenticate(req, res);

  const limit = 9;
  const prefetchedResults = await getTokenSearchResults(q, 0, limit, JSON.parse(forSale|| "false"));

  return {
    props: {
      address: req.address || null,
      q: q || '',
      limit,
      forSale: JSON.parse(forSale || "false"),
      prefetchedResults: [prefetchedResults]
    },
  }
}


export default function Search({ q, limit, forSale, prefetchedResults }) {


  const [forSaleToggle, setForSaleToggle] = useState(forSale);
  const [qChip, setQChip] = useState(q);

  const { results } = useSearchTokens(qChip, limit, forSaleToggle, prefetchedResults);

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
            display: "flex",
            marginY: 2,
            // paddingY: 2,
            // background: "#ddd",
            alignItems: 'center'
          }}>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexGrow: 1,
              flexWrap: 'wrap',

            }}
          >
            <Chip variant={qChip === '' ? 'filled' : 'outlined'} label="x" onClick={e => setQChip('')} ></Chip>
            <Chip variant={qChip === 'dug' ? 'filled' : 'outlined'} label="dug" onClick={e => setQChip('dug')} ></Chip>
            <Chip variant={qChip === 'dog' ? 'filled' : 'outlined'} label="dog" onClick={e => setQChip('dog')} ></Chip>
            <Chip variant={qChip === 'golden_retriever' ? 'filled' : 'outlined'} label="golden_retriever" onClick={e => setQChip('golden_retriever')} ></Chip>
            
          </Box>
          <Box
            sx={{
            }}>
            <FormGroup>
              <FormControlLabel sx={{ width: 'max-content', }} control={
                <Switch checked={forSaleToggle} onChange={(e) => setForSaleToggle(old => !old)} />}
                label="for sale" />
            </FormGroup>
          </Box>
        </Box>
        {results?.data[0]?.total === 0 &&
        <HodlImpactAlert message={"We can't find anything at the moment"} title="Sorry" />
      }
        <InfiniteScrollNftWindows swr={results} limit={limit} />
      </Box>
    </>
  )
}

