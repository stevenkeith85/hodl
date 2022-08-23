import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { assetType } from "../../lib/utils";
import { AssetTypes } from "../../models/AssetType";
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
    <Box
      display="flex"
      sx={{
        height: '550px',
        width: `100%`,
      }}>
      {!fileName && <Typography sx={{ margin: `auto` }}>[preview will appear here]</Typography>}
      {fileName && isImage() &&
        <FilteredImageMemo
          aspectRatio={aspectRatio}
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
          audio={assetType({
            creator: "",
            metadata: "",
            mimeType: formData.mimeType,
            id: 0,
            owner: "",
            name: "",
            description: "",
            image: "",
            privilege: "",
            forSale: false,
            price: ""
          }) === AssetTypes.Audio}
        />
      }
    </Box>
  )
}