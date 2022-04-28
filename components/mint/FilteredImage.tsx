import { memo } from 'react';
import { Box } from '@mui/material';
import { HodlImage } from '../HodlImage';
import { imageFilters } from '../../lib/utils';

export const FilteredImage = ({ 
  filter, 
  fileName, 
  onLoad
}) => {
  return (
    <>
      {imageFilters.map(({ code, name }, index) => (
        <Box
          key={index}
          sx={{
            display: filter === code ? 'flex' : 'none',
          }}
        >
          <HodlImage
            cid={fileName.split('/')[2]}
            folder="uploads"
            effect={code}
            onLoad={() => onLoad(false)}
            sizes = "(max-width:899px) 100vw, (max-width:1199px) 50vw"
          />
        </Box>
      ))}
    </>
  );
};
export const FilteredImageMemo = memo(FilteredImage);
