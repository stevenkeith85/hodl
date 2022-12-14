import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { imageFilters } from '../../lib/utils';


export const FilterButtons = ({ formData, setFormData }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr 1fr',
        sm: '1fr 1fr',
      },
      gap: 3
    }}
  >
    {imageFilters.map(({ code, name }, index) => (
      <Box key={code} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button
          key={index}
          variant={formData.filter === code ? 'contained' : 'outlined'}
          onClick={() => setFormData(prev => ({
            ...prev,
            filter: code
          }))}
          sx={{
            paddingX: 2.5,
            paddingY: 1.25,
            minWidth: '100px',
            textTransform: 'capitalize'
          }}>{name}</Button>
      </Box>
    ))}

  </Box>
);
