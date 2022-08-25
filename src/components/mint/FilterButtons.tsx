import { Box, Typography } from '@mui/material';
import { imageFilters } from '../../lib/utils';
import { HodlImageResponsive } from '../HodlImageResponsive';

export const FilterButtons = ({ formData, setFormData }) => (
  <Box
    sx={{
      display: 'grid',
      gap: 6,
      gridTemplateColumns: '1fr 1fr 1fr',
      gridTemplateRows: `1fr 1fr`,
    }}>
    {imageFilters.map(({ code, name }, index) => (
      <Box
        key={index}
        onClick={() => setFormData(prev => ({
          ...prev,
          filter: code
        }))}
        sx={{
          cursor: 'pointer',
        }}
      >
        {formData.fileName &&
          <HodlImageResponsive
            cid={formData.fileName.split('/')[2]}
            folder="uploads"
            effect={code}
            widths={[100, 200]}
            sizes="100px"
            aspectRatio={formData.aspectRatio}
          />}
        <Typography sx={{
          fontWeight: formData.filter === code ? '600' : '200',
        }}>{name}</Typography>
      </Box>
    ))}
  </Box>
);
