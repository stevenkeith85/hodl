import { HodlActionViewModel } from "../../models/HodlAction";
import { assetType } from "../../lib/utils";
import { AssetTypes } from "../../models/AssetType";
import { HodlVideo } from "../HodlVideo";
import { HodlImageResponsive } from "../HodlImageResponsive";
import { Box } from "@mui/material";


interface FeedAssetProps {
    item: HodlActionViewModel
}

export const FeedAsset: React.FC<FeedAssetProps> = ({ item }) => {

    const getHeightForAspectRatio = (width: number, aspectRatio: string = "1:1") => {

        if (aspectRatio === null) {
            aspectRatio = "1:1";
        }

        const [num, denom] = aspectRatio.split(':');

        const result = `calc(${+denom / +num} * min(90vw - 32px, ${width}px))`;

        return result;
    }

    return (<Box
        sx={{
            position: 'relative',
            height: getHeightForAspectRatio(575, item?.token?.properties?.aspectRatio)
        }}>

        {/* Responsive skeleton */}
        <Box sx={{
            position: 'absolute',
            zIndex: 0,
            
            width: 'min(575px, 90vw)',
            height: getHeightForAspectRatio(575, item?.token?.properties?.aspectRatio),

            background: '#ddd',
            animation: 'flicker 3s ease',
            animationIterationCount: 'infinite',
            animationFillMode: 'forwards',
            opacity: 0,
        }}>
        </Box>
        
        <Box sx={{ 
            position: 'relative',
            zIndex: 1
        }}>
            {
                (assetType(item.token) === AssetTypes.Image) &&
                <HodlImageResponsive
                    cid={item.token.image}
                    aspectRatio={item?.token?.properties?.aspectRatio || "1:1"}
                    gravity="g_face"
                    widths={[575, 700, 800, 900, 1000, 1080]}
                    sizes="575w"
                />
            }
            {
                (assetType(item.token) === AssetTypes.Video) &&
                <HodlVideo
                    cid={item.token.image}
                    controls={true}
                    onlyPoster={false}
                    audio={false}
                    sx={{
                        video: {
                            borderRadius: 0,
                            maxHeight: '500px'
                        }
                    }}
                />
            }
            {
                (assetType(item.token) === AssetTypes.Gif) &&
                <HodlVideo
                    cid={item.token.image}
                    gif={true}
                    sx={{
                        video: {
                            borderRadius: 0,
                            maxHeight: '500px'
                        }
                    }}
                />
            }
            {
                (assetType(item.token) === AssetTypes.Audio) &&
                <HodlVideo
                    cid={item.token.image}
                    controls={true}
                    onlyPoster={false}
                    height="280px"
                    audio={true}
                    sx={{
                        video: {
                            objectPosition: 'top',
                            borderRadius: 0,
                            maxHeight: '500px'
                        }
                    }}
                />
            }
        </Box>
    </Box >)
}