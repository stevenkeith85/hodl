import { memo } from 'react';
import { Box } from '@mui/material';

import { aspectRatios, imageFilters } from '../../lib/utils';
import { HodlVideo } from '../HodlVideo';

// We load all the aspect ratio variations and hide with css
export const FilteredVideo = ({ 
  aspectRatio,
  fileName, 
  onLoad
}) => {

  return (
    <>
      {aspectRatios.map((ratio, index) =>
        <Box
          key={index}
          sx={{
            display: aspectRatio === ratio ? 'flex' : 'none'
          }}
        >
          <HodlVideo 
            cid={fileName.split('/')[2]} 
            folder="uploads" 
            aspectRatio={ratio}
            onLoad={onLoad}
          />
        </Box>
      )}
    </>
  );
};
export const FilteredVideoMemo = memo(FilteredVideo);
