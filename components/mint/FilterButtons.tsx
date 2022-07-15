import { Box, Button, Skeleton, Typography } from '@mui/material';
import { imageFilters } from '../../lib/utils';
import { HodlImage } from '../HodlImage';

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
          // We are deliberately using the same dimensions as the preview pane as we don't want to fetch a new image here
          <HodlImage
            cid={formData.fileName.split('/')[2]}
            folder="uploads"
            effect={code}
            sizes="(max-width:899px) 100vw, (max-width:1199px) 50vw"
            fit='scale-down'
            height={'155px'}
            sx={{ img:{borderRadius: 0}}}
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
