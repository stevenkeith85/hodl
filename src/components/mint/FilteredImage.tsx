import { memo, useEffect, useState } from 'react';
import { aspectRatios, imageFilters } from '../../lib/utils';
import { HodlImageResponsive } from '../HodlImageResponsive';
import Box from '@mui/material/Box';


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
              widths={[600, 700, 800, 900, 1080]}
              sx={{ maxWidth: '100%', maxHeight:'100%'}}
            />
          </Box>
        )
      )}
    </>
  );
};
export const FilteredImageMemo = memo(FilteredImage);
