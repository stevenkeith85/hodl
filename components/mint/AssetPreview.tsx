import { Stack, Typography } from "@mui/material";
import { FC } from "react";
import { FilteredImageMemo } from "./FilteredImage";
import { FilteredVideoMemo } from "./FilteredVideo";
import { MintProps } from './models';


export const AssetPreview: FC<MintProps> = ({ 
  formData,
  setLoading,
}: MintProps) => {
  const {mimeType, fileName, filter} = formData;

  const isImage = () => mimeType && mimeType.indexOf('image') !== -1;
  const isVideo = () => mimeType && mimeType.indexOf('video') !== -1;
  
  return (
    <Stack spacing={2} sx={{ flexBasis: `50%`, justifyContent: 'center' }}>
      <Stack
        sx={{
          border: !fileName ? `1px solid #d0d0d0` : 'none',
          flexGrow: 1,
          minHeight: 400,
          borderRadius: `5px`,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        {!fileName && <Typography>Preview will appear here</Typography>}
        {fileName && isImage() && <FilteredImageMemo filter={filter} fileName={fileName} setLoading={setLoading} />}
        {fileName && isVideo() && <FilteredVideoMemo filter={filter} fileName={fileName} setLoading={setLoading} />}
      </Stack>
    </Stack>
  )
}