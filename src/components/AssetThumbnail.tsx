
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { assetType } from "../lib/utils";
import { AssetTypes } from "../models/AssetType";
import { Token } from "../models/Token";
import { HodlAudioBoxMini } from "./HodlAudioBoxMini";
import { HodlImageResponsive } from "./HodlImageResponsive";

interface AssetThumbnailProps {
    token: Token;
    size?: number;
}

interface TokenTooltipProps {
    token: Token;
}
export const TokenTooltip: React.FC<TokenTooltipProps> = ({ token }) => {
    return (
        <div>
            <Typography sx={{ fontSize: 14 }}>{token.name}</Typography>
        </div>
    )
}
export const AssetThumbnail: React.FC<AssetThumbnailProps> = ({ token, size = 44 }) => (
    <Tooltip
        title={<TokenTooltip token={token} />}
        arrow
        placement="right"
    >
        <Box
            sx={{
                cursor: 'pointer',
                width: size,
                height: size
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
    </Tooltip>
)