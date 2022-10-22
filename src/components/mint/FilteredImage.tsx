import { memo, useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { aspectRatios, getTopPadding, imageFilters } from '../../lib/utils';
import { HodlImageResponsive } from '../HodlImageResponsive';

export const FilteredImage = ({
  originalAspectRatio,
  aspectRatio,
  filter,
  fileName,
  onLoad
}) => {
  const [fullAspectRatios, setFullAspectRatios] = useState(aspectRatios);

  useEffect(() => {
    setFullAspectRatios([originalAspectRatio, ...aspectRatios]);
  }, [originalAspectRatio])

  
  return (
    <>
      {imageFilters.map(({ code, name }, index) =>
        fullAspectRatios.map(ratio =>
          <Box
            key={index}
            sx={{
              position: 'relative',
              width: `100%`,
              paddingTop: `${gestTopPadding(ratio)}%`,
              display: filter === code && aspectRatio === ratio ? 'flex' : 'none',
            }}
          >
            <Box sx={{ position: 'absolute', top: 0 }}>
              <HodlImageResponsive
                cid={fileName.split('/')[2]}
                folder="uploads"
                aspectRatio={ratio !== originalAspectRatio ? ratio : null}
                effect={code}
                onLoad={onLoad}
                sizes="(min-width: 900px) 50vw, (min-width: 1200px) calc(1200px / 2)"
                widths={[450, 600, 900, 1200]}
              />
            </Box>
          </Box>
        )
      )}
    </>
  );
};
export const FilteredImageMemo = memo(FilteredImage);
