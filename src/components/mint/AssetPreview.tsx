import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { HodlVideo } from "../HodlVideo";
import { FilteredImageMemo } from "./FilteredImage";
import { MintProps } from './models';
import calculateAspectRatios from 'calculate-aspect-ratio';
import { HodlAudio } from "../HodlAudio";

export const AssetPreview: FC<MintProps> = ({
  formData,
  setFormData,
  setLoading,
}: MintProps) => {
  const { mimeType, fileName, aspectRatio, filter } = formData;

  const isImage = () => mimeType && mimeType.indexOf('image') !== -1;
  const isVideo = () => mimeType && mimeType.indexOf('video') !== -1;
  const isAudio = () => mimeType && mimeType.indexOf('audio') !== -1;

  return (
    <Box>
      {/* {JSON.stringify(formData)} */}
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
          folder="uploads"
          cid={fileName.split('/')[2]}
          onLoad={(video) => {
            const aspectRatio = calculateAspectRatios(video.videoWidth, video.videoHeight);
            
            setFormData(old => ({
              ...old,
              aspectRatio
            }));
            
            setLoading();
          }}
        />
      }
      {fileName && isAudio() &&
        <HodlAudio
          cid={fileName.split('/')[2]}
          folder="uploads"
          onLoad={(audio) => {
            setLoading();
          }}
        />
      }
    </Box>
  )
}