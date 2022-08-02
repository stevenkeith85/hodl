import { Box } from "@mui/material";
import { assetType } from "../lib/utils";
import { AssetTypes } from "../models/AssetType";
import { Token } from "../models/Token"
import { HodlImage } from "./HodlImage";
import { HodlVideo } from "./HodlVideo";

interface AssetThumbnailProps {
    token: Token;
}

export const AssetThumbnail: React.FC<AssetThumbnailProps> = ({ token }) => {

    return (<Box
        sx={{ cursor: 'pointer' }}
    >
        {
            assetType(token) === AssetTypes.Image &&
            <a>
                <HodlImage
                    cid={token.image}
                    effect={token.filter}
                    height={'44px'}
                    width={'44px'}
                    sx={{ img: { borderRadius: 0 } }}
                />
            </a>
        }
        {assetType(token) === AssetTypes.Video &&
            <a>
                <HodlVideo
                    cid={token.image}
                    controls={false}
                    onlyPoster={true}
                    preload="none"
                    audio={false}
                    height='44px'
                    width='44px'
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
                    height='44px'
                    width='44px'
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
                    preload="none"
                    audio={true}
                    height='44px'
                    width='44px'
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