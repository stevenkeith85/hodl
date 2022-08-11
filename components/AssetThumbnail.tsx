import { Box } from "@mui/material";
import { assetType } from "../lib/utils";
import { AssetTypes } from "../models/AssetType";
import { Token } from "../models/Token"
import { HodlImage } from "./HodlImage";
import { HodlVideo } from "./HodlVideo";

interface AssetThumbnailProps {
    token: Token;
    size?: string;
}

export const AssetThumbnail: React.FC<AssetThumbnailProps> = ({ token, size="44px" }) => {

    return (<Box
        sx={{ cursor: 'pointer' }}
    >
        {
            assetType(token) === AssetTypes.Image &&
            <a>
                <HodlImage
                        cid={token.image}
                        effect={token.filter}
                        height={100}
                        width={100}
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
                    height={size}
                    width={size}
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
                    height={size}
                    width={size}
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
                    height={size}
                    width={size}
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