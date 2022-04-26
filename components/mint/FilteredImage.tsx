import { memo } from 'react';
import { Box } from '@mui/material';
import { HodlImage2 } from '../HodlImage2';
import { imageFilters } from '../../lib/utils';

// We load all the image variations and hide with css
export const FilteredImage = ({ filter, fileName, setLoading }) => {
  return (
    <>
      {imageFilters.map(({ code, name }, index) => (
        <Box
          key={index}
          sx={{
            display: filter === code ? 'flex' : 'none',
            // maxHeight: '66vh'
          }}
        >
          <HodlImage2
            image={fileName.split('/')[2]}
            folder="uploads"
            effect={code}
            onLoad={() => setLoading(false)} />
        </Box>
      ))}
    </>
  );
};
export const FilteredImageMemo = memo(FilteredImage);
