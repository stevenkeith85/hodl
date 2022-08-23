import useSWRInfinite from 'swr/infinite'
import axios from 'axios';
import useSWR from 'swr';
import { useState } from 'react';
import { Box, Chip, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';


interface TagsPaginatedProps {
  selected: string;
  onClick: (value) => void
}


export const TagsPaginated: React.FC<TagsPaginatedProps> = ({ onClick, selected }) => {
  const [offset, setOffset] = useState(0);
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only('xs'));

  const limit = xs ? 3 : 4;

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
      alignItems: 'center',
      justifyContent: 'space-between',
      width: {
        xs: `100%`,
        sm: 'auto'
      }
    }}
  >
    <IconButton disabled={offset === 0} onClick={() => setOffset(offset - limit)}>
      <NavigateBefore />
    </IconButton>
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        width: {
          md: 'calc(1200px / 2.5)'
        },
        overflow: 'hidden',
        justifyContent: 'center'
      }}>
      {
        data?.items?.map(tag =>
          <Chip color="primary" label={tag} onClick={() => onClick(tag)} key={tag} variant={selected === tag ? 'filled': 'outlined'}/>
        )
      }
    </Box>

    <IconButton disabled={data?.next >= data?.total} onClick={() => setOffset(offset + limit)}>
      <NavigateNext />
    </IconButton>
  </Box>)

}
