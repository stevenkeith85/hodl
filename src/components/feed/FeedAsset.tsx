import { HodlActionViewModel } from "../../models/HodlAction";
import { assetType, getTopPadding } from "../../lib/utils";
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

    const asset = <Box
        sx={{
            position: 'relative',
            width: `100%`,
            paddingTop: item?.token?.properties?.aspectRatio ? `${getTopPadding(item.token.properties.aspectRatio)}%` : 0,
        }}
    >
        <Box sx={{
            width: `100%`,
            position: item?.token?.properties?.aspectRatio ? 'absolute' : 'static',
            top: 0
        }}>
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
                    <Box sx={{ visibility: 'hidden' }}>
                        <HodlImageResponsive
                            cid={item.token.image}
                            widths={[575, 700, 800, 900, 1000, 1080]}
                            sizes="575w"
                            maxHeight="575px"
                            width="100%"
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
                            maxHeight="575px"
                            height="100%"
                            onLoad={() => setLoading(false)}
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
    </Box>;

    return (
        <Box>
            <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{
                    display: loading ? 'block' : 'none',
                    width: "100%",
                    paddingTop: item.token.properties.aspectRatio ? `${getTopPadding(item.token.properties.aspectRatio)}%` : 0
                }}
            >
            </Skeleton>

            <Box sx={{
                display: loading ? 'none' : 'block'
            }}>
                {asset}
            </Box>
        </Box >)
}