import { memo } from 'react';
import { Box } from '@mui/material';
import { aspectRatios, imageFilters } from '../../lib/utils';
import { HodlImageResponsive } from '../HodlImageResponsive';

export const FilteredImage = ({
  aspectRatio,
  filter,
  fileName,
  onLoad
}) => {
  return (
    <>
      {imageFilters.map(({ code, name }, index) => 
        aspectRatios.map(ratio =>
          <Box
            key={index}
            sx={{
              width: `100%`,
              display: filter === code && aspectRatio === ratio ? 'flex' : 'none',
            }}
            padding={0}
          >
            <HodlImageResponsive
              cid={fileName.split('/')[2]}
              folder="uploads"
              aspectRatio={ratio}
              effect={code}
              onLoad={onLoad}
              sizes="(min-width: 900px) 50vw, (min-width: 1200px) calc(1200px / 2)"
              widths={[450, 600, 900, 1200]}
            />
          </Box>
        )
      )}
    </>
  );
};
export const FilteredImageMemo = memo(FilteredImage);
