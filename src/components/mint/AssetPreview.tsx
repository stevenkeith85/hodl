import Box from "@mui/material/Box";
import { FC } from "react";
import { HodlVideo } from "../HodlVideo";
import { FilteredImage, FilteredImageMemo } from "./FilteredImage";
import { MintProps } from './models';
import { HodlAudio } from "../HodlAudio";


export const AssetPreview: FC<MintProps> = ({
  originalAspectRatio,
  formData,
  setFormData,
  // setLoading,
}: MintProps) => {
  const { mimeType, fileName } = formData;

  const isImage = () => mimeType && mimeType.indexOf('image') !== -1;
  const isGif = () => mimeType && mimeType.indexOf('gif') !== -1;
  const isVideo = () => mimeType && mimeType.indexOf('video') !== -1;
  const isAudio = () => mimeType && mimeType.indexOf('audio') !== -1;
  
  return (
    <Box
      sx={{ 
        background: '#f0f0f0',
        // height: '300px',
        height: {
          xs: 300,
          md: 350,
        },
        maxWidth: {
          xs: '533px',
          md: '622px',
        },
        // maxWidth: '633px', // 16:9
        width: '100%'

      }}
    >
      {fileName && isImage() && !isGif() &&
        <FilteredImageMemo
          originalAspectRatio={originalAspectRatio}
          formData={formData}
        />
      }
      {fileName && isGif() &&
        <HodlVideo
          assetFolder="image"
          gif={true}
          folder="uploads"
          cid={fileName.split('/')[2]}
        />
      }
      {fileName && isVideo() &&
        <>
          <HodlVideo
            folder="uploads"
            cid={fileName.split('/')[2]}
          />
        </>
      }
      {fileName && isAudio() &&
        <HodlAudio
          cid={fileName.split('/')[2]}
          folder="uploads"
          sx={{ audio: { width: '80%' } }}
          mimeType={mimeType}
        />
      }
    </Box>
  )
}