import axios from 'axios';
import useSWR from 'swr';
import { useState } from 'react';

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';


interface TagsPaginatedProps {
  limit: number;
  selected: string;
  onClick: (value) => void,
  fallbackData: any
}

// https://swr.vercel.app/docs/pagination#advanced-cases
const Page = ({ offset, limit, onClick, selected, fetcher, fallbackData }) => {
  const { data } = useSWR([`/api/rankings/tag`, offset, limit], fetcher, { fallbackData });

  if (!data) {
    return null;
  }

  return (<Box
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
        <Chip
          color="primary"
          label={tag}
          onClick={() => onClick(tag)}
          key={tag}
          variant={selected?.toLowerCase() === tag?.toLowerCase() ? 'filled' : 'outlined'}
        />
      )
    }
  </Box>
  );
}

export const TagsPaginated: React.FC<TagsPaginatedProps> = ({ limit, onClick, selected, fallbackData }) => {
  
  const [offset, setOffset] = useState(0);

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

  const { data } = useSWR([`/api/rankings/tag`, offset, limit], fetcher, {fallbackData});

  if (!data || data.total === 0) {
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
    <IconButton
      disabled={offset === 0}
      onClick={() => setOffset(offset - limit)}>
      <NavigateBeforeIcon fontSize='small'/>
    </IconButton>
    <Page 
      offset={offset} 
      limit={limit} 
      onClick={onClick} 
      selected={selected} 
      fetcher={fetcher} 
      fallbackData={offset == 0 ? fallbackData: null} 
    />
    <div 
      style={{ display: 'none' }}>
        <Page 
          offset={offset + limit} 
          limit={limit} 
          onClick={onClick} 
          selected={selected} 
          fetcher={fetcher} 
          fallbackData={null}/>
        </div>
    <IconButton
      disabled={offset + limit >= data?.total}
      onClick={() => setOffset(offset + limit)}
    >
      <NavigateNextIcon fontSize='small'/>
    </IconButton>
  </Box>)

}
