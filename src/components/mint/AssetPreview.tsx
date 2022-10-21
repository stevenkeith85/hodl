import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { HodlVideo } from "../HodlVideo";
import { FilteredImageMemo } from "./FilteredImage";
import { MintProps } from './models';
import calculateAspectRatios from 'calculate-aspect-ratio';
import { HodlAudio } from "../HodlAudio";
import { validAspectRatio } from "../../lib/utils";

export const AssetPreview: FC<MintProps> = ({
  formData,
  setFormData,
  setLoading,
}: MintProps) => {
  const { mimeType, fileName, aspectRatio, filter } = formData;

  const isImage = () => mimeType && mimeType.indexOf('image') !== -1;
  const isGif = () => mimeType && mimeType.indexOf('gif') !== -1;
  const isVideo = () => mimeType && mimeType.indexOf('video') !== -1;
  const isAudio = () => mimeType && mimeType.indexOf('audio') !== -1;

  return (
    <Box
      className="assetPreview"
      sx={{ width: '100%' }}
    >
      {fileName && isImage() && !isGif() &&
        <FilteredImageMemo
          aspectRatio={aspectRatio}
          filter={filter}
          fileName={fileName}
          onLoad={setLoading}
        />}
      {fileName && isGif() &&
        <HodlVideo
          assetFolder="image"
          gif={true}
          folder="uploads"
          cid={fileName.split('/')[2]}
          onLoad={(video) => {
            setLoading();
          }}
        />
      }
      {fileName && isVideo() &&
        <>
          {fileName}
          <HodlVideo
            folder="uploads"
            cid={fileName.split('/')[2]}
            onLoad={(video) => {
              const aspectRatio = calculateAspectRatios(video.videoWidth, video.videoHeight);

              if (validAspectRatio(aspectRatio)) {
                setFormData(old => ({
                  ...old,
                  aspectRatio
                }));
              }

              setLoading(false);
            }}
          />
        </>
      }
      {fileName && isAudio() &&
        <HodlAudio
          cid={fileName.split('/')[2]}
          folder="uploads"
          sx={{ audio: { width: '80%' } }}
          onLoad={(audio) => {
            setLoading();
          }}
          mimeType={mimeType}
        />
      }
    </Box>
  )
}