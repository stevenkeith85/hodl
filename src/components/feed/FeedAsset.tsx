import { HodlActionViewModel } from "../../models/HodlAction";
import { assetType } from "../../lib/utils";
import { AssetTypes } from "../../models/AssetType";
import { HodlVideo } from "../HodlVideo";
import { HodlImageResponsive } from "../HodlImageResponsive";
import { Box } from "@mui/material";
import { HodlAudioBox } from "../HodlAudioBox";
import { PriceSticker } from "../PriceSticker";


interface FeedAssetProps {
    item: HodlActionViewModel;
}

export const FeedAsset: React.FC<FeedAssetProps> = ({ item }) => {

    const getHeightForAspectRatio = (width: number, aspectRatio: string = "1:1") => {
        if (aspectRatio === null) {
            aspectRatio = "1:1";
        }

        const [num, denom] = aspectRatio.split(':');

        const result = `calc(${+denom / +num} * min(100% - 32px, ${width}px))`;

        return result;
    }

    return (
        <Box
            sx={{
                position: 'relative',
                height: (assetType(item.token) === AssetTypes.Audio) ?
                    324 + 54 + 16 : // audio 'image' is 324, the controls are 54, and we want 16 additional pixels of spacing
                    getHeightForAspectRatio(575, item?.token?.properties?.aspectRatio)
            }}>

            {/* Responsive skeleton */}
            <Box sx={{
                position: 'absolute',
                zIndex: 0,

                width: 'min(575px, 100%)',
                height: (assetType(item.token) === AssetTypes.Audio) ?
                    324 : // audio 'image' is 324
                    getHeightForAspectRatio(575, item?.token?.properties?.aspectRatio),

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
                        cid={item.token?.properties?.asset?.uri}
                        aspectRatio={item?.token?.properties?.aspectRatio || "1:1"}
                        gravity="g_face"
                        widths={[575, 700, 800, 900, 1000, 1080]}
                        sizes="575w"
                    />
                }
                {
                    (assetType(item.token) === AssetTypes.Video) &&
                    <HodlVideo
                        cid={item.token?.properties?.asset?.uri}
                        controls={true}
                    />
                }
                {
                    (assetType(item.token) === AssetTypes.Gif) &&
                    <HodlVideo
                        cid={item.token?.properties?.asset?.uri}
                        gif={true}
                        assetFolder="image"
                        height={'575px'}
                    />
                }
                {
                    (assetType(item.token) === AssetTypes.Audio) &&
                    <HodlAudioBox token={item.token} audio={true} size={80} />
                }
            </Box>
            
            {
                item?.metadata?.price &&
                 <PriceSticker price={item?.metadata?.price} />
            }
        </Box >)
}