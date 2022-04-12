import { memo, useEffect } from 'react';
import { Box } from '@mui/material';

import { imageFilters } from '../../lib/utils';
import { HodlVideo } from '../HodlVideo';

// We load all the filter variations and hide with css
export const FilteredVideo = ({ filter, fileName, setLoading }) => {

  useEffect(() => {
    console.log('effect changed')
  }, [filter]);

  return (
    <>
      {imageFilters.map(({ code, name }, index) => (
        <Box
          key={index}
          sx={{
            display: filter === code ? 'flex' : 'none'
          }}
        >
          <HodlVideo cid={fileName.split('/')[2]} directory="uploads" onLoad={() => setLoading(false)} transformations={code}/>
        </Box>
      ))}
    </>
  );
};
export const FilteredVideoMemo = memo(FilteredVideo);
