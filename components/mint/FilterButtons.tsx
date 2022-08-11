import { Box, Button, Skeleton, Typography } from '@mui/material';
import { imageFilters } from '../../lib/utils';
import { HodlImage } from '../HodlImage';
import { HodlImageResponsive } from '../HodlImageResponsive';

export const FilterButtons = ({ formData, setFormData }) => (
  <Box
    sx={{
      display: 'grid',
      gap: 3,
      gridTemplateColumns: '1fr 1fr 1fr',
      gridTemplateRows: `1fr 1fr`,
      height: `100%`
    }}>
    {imageFilters.map(({ code, name }, index) => (
      <Box
        key={index}
        display='flex'
        flexDirection={'column'}
        gap={1}
        overflow='auto'
        alignItems="center"
        onClick={() => setFormData(prev => ({
          ...prev,
          filter: code
        }))}
        sx={{
          cursor: 'pointer',
        }}
      >
        {formData.fileName &&
          // We are deliberately using the same 'sizes' as the preview pane as we don't want to fetch a new image here
          <HodlImageResponsive
            cid={formData.fileName.split('/')[2]}
            folder="uploads"
            effect={code}
            sizes="(min-width: 900px) 50vw, (min-width: 1200px) calc(1200px / 2)"
          />}
        {!formData.fileName &&
          <Skeleton
            variant='rectangular'
            height={155}
            width='100%'
            sx={{ border: '1px solid #ddd'}}
          />}
        <Typography sx={{
          fontWeight: formData.filter === code ? '600' : '200',
        }}>{name}</Typography>
      </Box>
    ))}
  </Box>
);
