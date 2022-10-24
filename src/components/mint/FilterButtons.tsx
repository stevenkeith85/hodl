import { Box, Typography } from '@mui/material';
import { imageFilters } from '../../lib/utils';
import { HodlImageResponsive } from '../HodlImageResponsive';

export const FilterButtons = ({ formData, setFormData }) => (
  <Box
    sx={{
      width: '100%',
      display: 'grid',
      gap: {
        xs: 2,
        sm: 3
      },
      gridTemplateColumns: {
        xs: '1fr 1fr',
      }
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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {formData.fileName &&
          <HodlImageResponsive
            assetFolder={"image"}
            folder="uploads"
            cid={formData.fileName.split('/')[2]}
            effect={code}
            widths={[125, 250]}
            sizes="125px"
            aspectRatio={formData.aspectRatio}
          />
        }
        <Typography
          sx={{
            fontWeight: formData.filter === code ? '600' : '200',
            margin: 2
          }}>{name}</Typography>
      </Box>
    ))}
  </Box>
);
