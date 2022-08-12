import { Box } from "@mui/material";
import { assetType } from "../lib/utils";
import { AssetTypes } from "../models/AssetType";
import { Token } from "../models/Token"
import { HodlImage } from "./HodlImage";
import { HodlImageResponsive } from "./HodlImageResponsive";
import { HodlVideo } from "./HodlVideo";

interface AssetThumbnailProps {
    token: Token;
    size?: number;
}

export const AssetThumbnail: React.FC<AssetThumbnailProps> = ({ token, size = 44 }) => {

    return (<Box
        sx={{ cursor: 'pointer', width: `${size}px` }}
    >
        {
            assetType(token) === AssetTypes.Image &&
            <a>
                <HodlImageResponsive
                    cid={token.image}
                    widths={[size, size * 2]}
                    sizes={`${size}px`}
                    aspectRatio="1:1"
                    gravity="g_face:center"
                />
            </a>
        }
        {assetType(token) === AssetTypes.Video &&
            <a>
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
            </a>
        }
        {assetType(token) === AssetTypes.Gif &&
            <a>
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
            </a>
        }
        {assetType(token) === AssetTypes.Audio &&
            <a>
                <HodlVideo
                    cid={token.image}
                    controls={false}
                    onlyPoster={true}
                    audio={true}
                    height={`${size}px`}
                    width={`${size}px`}
                    sx={{
                        video: {
                            objectFit: 'contain',
                            objectPosition: 'center',
                            borderRadius: 0,
                            background: '#fafafa',
                        }
                    }}
                />
            </a>
        }
    </Box>)
}