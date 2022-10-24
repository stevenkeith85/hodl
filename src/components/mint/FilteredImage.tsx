import { memo, useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { aspectRatios, getTopPadding, imageFilters } from '../../lib/utils';
import { HodlImageResponsive } from '../HodlImageResponsive';
import { makeCloudinaryUrl } from '../../lib/cloudinaryUrl';

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
        Array.from(new Set(fullAspectRatios)).map((ratio: string) =>
          <Box
            key={`${code}-${ratio}`}
            sx={{
              display: ratio == aspectRatio && filter == code ? 'block' : 'none'
            }}>
            <HodlImageResponsive
              assetFolder={"image"}
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
