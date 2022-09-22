import { MusicNote } from "@mui/icons-material";
import { Box, Tooltip, Typography } from "@mui/material";
import { assetType } from "../lib/utils";
import { AssetTypes } from "../models/AssetType";
import { Token } from "../models/Token"
import { HodlAudio } from "./HodlAudio";
import { HodlAudioBox } from "./HodlAudioBox";
import { HodlAudioBoxMini } from "./HodlAudioBoxMini";
import { HodlImageResponsive } from "./HodlImageResponsive";
import { HodlVideo } from "./HodlVideo";

interface AssetThumbnailProps {
    token: Token;
    size?: number;
}

interface TokenTooltipProps {
    token: Token;
}
export const TokenTooltip: React.FC<TokenTooltipProps> = ({ token }) => {
    return (
        <Box>
            <Typography sx={{ fontSize: 14 }}>{token.name}</Typography>
        </Box>
    )
}
export const AssetThumbnail: React.FC<AssetThumbnailProps> = ({ token, size = 44 }) => {

    return (
        <Tooltip
            title={<TokenTooltip token={token}/>}
            arrow 
            placement="right"
        >
            <Box
                sx={{
                    cursor: 'pointer',
                    width: `100%`,
                    height: '100%'
                }}
            >
                {
                    assetType(token) === AssetTypes.Image &&
                    <HodlImageResponsive
                        cid={token.image}
                        widths={[size, size * 2]}
                        sizes={`${size}px`}
                        aspectRatio="1:1"
                        gravity="g_face:center"
                    />
                }
                {assetType(token) === AssetTypes.Video &&
                    <HodlVideo
                        cid={token.image}
                        controls={false}
                        onlyPoster={true}
                        audio={false}
                        height={`${size}px`}
                        width={`${size}px`}
                        sx={{
                            video: {
                                objectFit: 'cover',
                                objectPosition: 'center',
                                borderRadius: 0,
                                background: '#fafafa',
                            }
                        }}
                    />
                }
                {assetType(token) === AssetTypes.Gif &&
                    <HodlVideo
                        cid={token.image}
                        gif={true}
                        height={`${size}px`}
                        width={`${size}px`}
                        sx={{
                            video: {
                                objectFit: 'cover',
                                objectPosition: 'center',
                                borderRadius: 0,
                                background: '#fafafa',
                            }
                        }}
                    />
                }
                {assetType(token) === AssetTypes.Audio &&
                    <HodlAudioBoxMini size={size} />
                }
            </Box>
        </Tooltip>
    )
}