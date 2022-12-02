import Box from "@mui/material/Box";
import { FC } from "react";
import { HodlVideo } from "../HodlVideo";
import { FilteredImageMemo } from "./FilteredImage";
import { MintProps } from './models';
import { HodlAudio } from "../HodlAudio";


export const AssetPreview: FC<MintProps> = ({
  originalAspectRatio,
  formData,
  setFormData,
  setLoading,
}: MintProps) => {
  const { mimeType, fileName, aspectRatio, filter } = formData;

  const isImage = () => mimeType && mimeType.indexOf('image') !== -1;
  const isGif = () => mimeType && mimeType.indexOf('gif') !== -1;
  const isVideo = () => mimeType && mimeType.indexOf('video') !== -1;
  const isAudio = () => mimeType && mimeType.indexOf('audio') !== -1;

  if (!fileName) {
    return null;
  }
  
  return (
    <Box
      className="assetPreview"
      sx={{ 
        width: '100%',
      }}
    >
      {fileName && isImage() && !isGif() &&
        <FilteredImageMemo
          originalAspectRatio={originalAspectRatio}
          aspectRatio={aspectRatio}
          filter={filter}
          fileName={fileName}
          onLoad={setLoading}
        />
      }
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
          <HodlVideo
            folder="uploads"
            cid={fileName.split('/')[2]}
            onLoad={(video) => {
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