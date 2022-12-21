
import Box from "@mui/material/Box";
import { assetType } from "../lib/assetType";
import { AssetTypes } from "../models/AssetType";
import { Token } from "../models/Token";
import { HodlAudioBoxMini } from "./HodlAudioBoxMini";
import { HodlImageResponsive } from "./HodlImageResponsive";

interface AssetThumbnailProps {
    token: Token;
    size?: number;
}

export const AssetThumbnail: React.FC<AssetThumbnailProps> = ({ token, size = 44 }) => (
    <Box
        sx={{
            cursor: 'pointer',
            width: "100%",
            height: "auto"
        }}
    >
        {assetType(token) === AssetTypes.Image &&
            <HodlImageResponsive
                assetFolder={"image"}
                folder="nfts"
                cid={token?.properties?.asset?.uri}
                widths={[size, size * 2]}
                sizes={`${size}px`}
                aspectRatio="1:1" />}
        {assetType(token) === AssetTypes.Video &&
            <HodlImageResponsive
                assetFolder={"image"}
                folder="nfts"
                cid={token?.image}
                widths={[size, size * 2]}
                sizes={`${size}px`}
                aspectRatio="1:1" />}
        {assetType(token) === AssetTypes.Gif &&
            <HodlImageResponsive
                assetFolder={"image"}
                folder="nfts"
                cid={token?.image}
                widths={[size, size * 2]}
                sizes={`${size}px`}
                aspectRatio="1:1"
            />}
        {assetType(token) === AssetTypes.Audio &&
            <HodlAudioBoxMini size={size} />}
    </Box>
)