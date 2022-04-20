import { Box } from '@mui/material';
import { HodlButton } from '../index';
import { imageFilters } from '../../lib/utils';

export const FilterButtons = ({ formData, setFormData }) => (
  <Box 
    sx={{ 
      display: 'grid', 
      gap: 2,
      gridTemplateColumns: '1fr 1fr 1fr'
    }}>
    {imageFilters.map(({ code, name }, index) => (
      <HodlButton 
        key={index} 
        sx={{ 
          textTransform: 'capitalize'
        }} 
        color={formData.filter === code ? 'secondary' : 'primary'} 
        onClick={() => setFormData(prev => ({
          ...prev,
          filter: code
        }))}>{name}
      </HodlButton>
    ))}
  </Box>
);
