import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { assetType } from "../../lib/utils";
import { AssetTypes } from "../../models/AssetType";
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
  const isAudio = () => mimeType && mimeType.indexOf('audio') !== -1;
  
  return (
      <Box
        display="flex"
        sx={{
          height: `400px`,
          overflow: 'hidden',
          borderRadius: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        { !fileName && <Typography>Preview Will Appear Here</Typography> }
        {fileName && isImage() && 
          <FilteredImageMemo 
            filter={filter} 
            fileName={fileName} 
            onLoad={setLoading} 
          />}
        {fileName && (isVideo() || isAudio()) && 
          <HodlVideo 
            cid={fileName.split('/')[2]} 
            folder="uploads" 
            onLoad={setLoading}
            height={'400px'}
            audio = {assetType({
              mimeType: formData.mimeType,
              tokenId: 0,
              owner: "",
              name: "",
              description: "",
              image: "",
              filter: "",
              privilege: "",
              ipfsMetadata: "",
              ipfsMetadataGateway: "",
              ipfsImage: "",
              ipfsImageGateway: "",
              forSale: false,
              price: ""
            }) === AssetTypes.Audio}
          />
        }
      </Box>
  )
}