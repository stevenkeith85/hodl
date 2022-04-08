import { Stack } from '@mui/material';
import { HodlButton } from '../index';
import { imageFilters } from '../../lib/utils';

export const FilterButtons = ({ filter, setFilter }) => (
  <Stack direction="row" spacing={2}>
    {imageFilters.map(({ code, name }, index) => (
      <HodlButton key={index} sx={{ textTransform: 'capitalize' }} color={filter === code ? 'secondary' : 'primary'} onClick={() => setFilter(code)}>{name}</HodlButton>
    ))}
  </Stack>
);
