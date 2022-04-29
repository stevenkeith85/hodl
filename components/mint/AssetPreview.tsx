import { Skeleton, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { HodlVideo } from "../HodlVideo";
import { FilteredImageMemo } from "./FilteredImage";
import { FilteredVideoMemo } from "./FilteredVideo";
import { MintProps } from './models';


export const AssetPreview: FC<MintProps> = ({ 
  loading,
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
          minHeight: fileName ? 'auto' : 400,
          borderRadius: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        { !fileName && <Skeleton   
                    variant="rectangular"
                    width="100%"
                    height={400} /> }
        {fileName && isImage() && 
          <FilteredImageMemo 
            filter={filter} 
            fileName={fileName} 
            onLoad={setLoading} 
          />}
        {fileName && isVideo() && 
          // Video transformations are too expensive on cloudinary
          // <FilteredVideoMemo 
          //   filter={filter} 
          //   fileName={fileName} 
          //   onLoad={setLoading} 
          // />
          <HodlVideo 
            cid={fileName.split('/')[2]} 
            folder="uploads" 
            onLoad={setLoading}
          />
        }
      </Stack>
    </Stack>
  )
}