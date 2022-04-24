import { Box, Stack, Typography } from '@mui/material'
import Head from 'next/head';
import { RocketTitle } from '../components';

export default function RateLimited() {
    
  return (
    <>
      <Head>
        <title>Rate Limited</title>
      </Head>
      <Stack spacing={2} marginY={4}>
        <RocketTitle title="Rate Limit Exceeded" />
        <Typography>Woah buddy. Slow down a little.</Typography>
      </Stack>
    </>
  )
}

