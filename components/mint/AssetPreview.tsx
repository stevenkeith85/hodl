import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { assetType } from "../../lib/utils";
import { AssetTypes } from "../../models/AssetType";
import { HodlBorderedBox } from "../HodlBorderedBox";
import { HodlVideo } from "../HodlVideo";
import { FilteredImageMemo } from "./FilteredImage";
import { FilteredVideoMemo } from "./FilteredVideo";
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
    // <HodlBorderedBox sx={{ padding: 0 }}>
    <Box
      display="flex"
      // flexDirection={"column"}
      sx={{
        height: '400px',
        width: `100%`,
      }}>
      {!fileName && <Typography sx={{ margin: `auto` }}>Preview Will Appear Here</Typography>}
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
            filter: "",
            privilege: "",
            forSale: false,
            price: ""
          }) === AssetTypes.Audio}
        />
      }
    </Box>
    // </HodlBorderedBox>
  )
}