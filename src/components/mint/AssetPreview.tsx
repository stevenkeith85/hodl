import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { HodlVideo } from "../HodlVideo";
import { FilteredImageMemo } from "./FilteredImage";
import { MintProps } from './models';


export const AssetPreview: FC<MintProps> = ({
  loading,
  formData,
  setLoading,
}: MintProps) => {
  const { mimeType, fileName, aspectRatio, filter } = formData;

  const isImage = () => mimeType && mimeType.indexOf('image') !== -1;
  const isVideo = () => mimeType && mimeType.indexOf('video') !== -1;
  const isAudio = () => mimeType && mimeType.indexOf('audio') !== -1;

  return (
    <Box>
      {!fileName &&
        <Typography sx={{ margin: `auto`, color: theme => theme.palette.text.secondary }}>Asset preview will appear here</Typography>
      }
      {fileName && isImage() &&
        <FilteredImageMemo
          aspectRatio={aspectRatio}
          filter={filter}
          fileName={fileName}
          onLoad={setLoading}
        />}
      {fileName && isVideo() &&
        <HodlVideo
          cid={fileName.split('/')[2]}
          folder="uploads"
          onLoad={setLoading}
          audio={false}
        />
      }
      {fileName && isAudio() &&
        <HodlVideo
          cid={fileName.split('/')[2]}
          folder="uploads"
          onLoad={setLoading}
          audio={true}
        />
      }
    </Box>
  )
}