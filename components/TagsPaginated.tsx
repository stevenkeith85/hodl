import useSWRInfinite from 'swr/infinite'
import axios from 'axios';
import useSWR from 'swr';
import { useState } from 'react';
import { Box, Chip, IconButton } from '@mui/material';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';


interface TagsPaginatedProps {
  onClick: (value) => void
}


export const TagsPaginated: React.FC<TagsPaginatedProps> = ({ onClick }) => {
  const [offset, setOffset] = useState(0);
  const limit = 4;

  const fetcher = (
    url: string,
    offset: number,
    limit: number) => axios.get(
      url,
      {
        params: {
          offset,
          limit
        },
        headers: {
          'Accept': 'application/json',
        }
      }).then(r => r.data);

  const { data } = useSWR([`/api/rankings/tag`, offset, limit], fetcher);

  if (!data) {
    return null;
  }

  return (<Box
    sx={{
      display: 'flex',
      gap: 1,
      alignItems: 'center'
    }}
  >
    <IconButton disabled={offset === 0} onClick={() => setOffset(offset - limit)}>
      <NavigateBefore />
    </IconButton>
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        justifyContent: 'center',
        width: {
          xs: '30vw',
          md: 'calc(1200px / 2.5)'
        },
        overflow: 'hidden'
      }}>
    {
      data?.items?.map(tag =>
        <Chip label={tag} onClick={() => onClick(tag)} key={tag}/>
      )
    }
    </Box>

    <IconButton disabled={data?.next >= data?.total}onClick={() => setOffset(offset + limit)}>
      <NavigateNext />
    </IconButton>
  </Box>)

}
