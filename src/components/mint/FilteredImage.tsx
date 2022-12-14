import { memo, useEffect, useState } from 'react';
import { aspectRatios, imageFilters } from '../../lib/utils';
import Box from '@mui/material/Box';
import { HodlPreviewImage } from '../HodlPreviewImage';


export const FilteredImage = ({
  originalAspectRatio,
  formData,
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
              alignItems:'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              display: ratio == formData.aspectRatio && formData.filter == code ? 'flex' : 'none'
            }}>
            <HodlPreviewImage
              assetFolder={"image"}
              cid={formData?.fileName?.split('/')?.[2]}
              folder="uploads"
              aspectRatio={ratio}
              effect={code}
              sizes="100vw"
            />
          </Box>
        )
      )}
    </>
  );
};

export const FilteredImageMemo = memo(FilteredImage);