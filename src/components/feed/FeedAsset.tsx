import { HodlActionViewModel } from "../../models/HodlAction";
import { assetType } from "../../lib/utils";
import { AssetTypes } from "../../models/AssetType";
import { HodlVideo } from "../HodlVideo";
import { HodlImageResponsive } from "../HodlImageResponsive";
import { Box, Skeleton } from "@mui/material";
import { HodlAudioBox } from "../HodlAudioBox";
import { PriceSticker } from "../PriceSticker";
import { useRef, useState } from "react";


interface FeedAssetProps {
    item: HodlActionViewModel;
}

export const FeedAsset: React.FC<FeedAssetProps> = ({ item }) => {
    const [loading, setLoading] = useState(true);

    const asset = <>
        <Box sx={{}}>
            {
                (assetType(item.token) === AssetTypes.Image) &&
                <HodlImageResponsive
                    cid={item.token?.properties?.asset?.uri}
                    aspectRatio={item?.token?.properties?.aspectRatio || "1:1"}
                    gravity="g_face"
                    widths={[575, 700, 800, 900, 1000, 1080]}
                    sizes="575w"
                    onLoad={() => setLoading(false)}
                />
            }
            {
                (assetType(item.token) === AssetTypes.Video) && <Box>
                    <Box
                        sx={{
                            visibility: 'hidden'
                        }}>
                        <HodlImageResponsive
                            cid={item.token.image}
                            widths={[575, 700, 800, 900, 1000, 1080]}
                            sizes="575w"
                            onLoad={() => setLoading(false)}
                        />
                    </Box>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            width: '100%'
                        }}
                    >
                        <HodlVideo
                            poster={item.token?.image}
                            cid={item.token?.properties?.asset?.uri}
                            controls={true}
                            height={'575px'}
                            sx={{
                                video: {
                                    width: 'auto'
                                }
                            }}
                        />
                    </Box>
                </Box>
            }
            {
                (assetType(item.token) === AssetTypes.Gif) &&
                <HodlVideo
                    cid={item.token?.properties?.asset?.uri}
                    gif={true}
                    assetFolder="image"
                    height={'575px'}
                    sx={{
                        video: {
                            width: 'auto'
                        }
                    }}
                    onLoad={() => setLoading(false)}
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
    </>;

    return (
        <Box
            sx={{
                position: 'relative',
            }}>
            {loading &&
                <Skeleton
                    variant="rectangular"
                    animation="wave"
                >
                    {asset}
                </Skeleton>
            }
            <Box sx={{
                display: loading ? 'none' : 'block'
            }}>{asset}</Box>
        </Box >)
}