import { useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

import { HodlActionViewModel } from "../../models/HodlAction";
import { assetType, getTopPadding } from "../../lib/utils";
import { AssetTypes } from "../../models/AssetType";
import { HodlVideo } from "../HodlVideo";
import { HodlImageResponsive } from "../HodlImageResponsive";
import { HodlAudioBox } from "../HodlAudioBox";
import { PriceSticker } from "../PriceSticker";

interface FeedAssetProps {
    item: HodlActionViewModel;
}

export const FeedAsset: React.FC<FeedAssetProps> = ({ item }) => {
    const [loading, setLoading] = useState(true);

    const asset = <div>
        <div>
            {
                (assetType(item.token) === AssetTypes.Image) &&
                <HodlImageResponsive
                    assetFolder={"image"}
                    folder="nfts"
                    cid={item.token?.properties?.asset?.uri}
                    aspectRatio={item?.token?.properties?.aspectRatio || "1:1"}
                    widths={[575, 700, 800, 900, 1000, 1080]}
                    sizes="575w"
                    onLoad={() => setLoading(false)}
                />
            }
            {
                (assetType(item.token) === AssetTypes.Video) &&
                <HodlVideo
                    poster={item.token?.image}
                    cid={item.token?.properties?.asset?.uri}
                    aspectRatio={item?.token?.properties?.aspectRatio || "1:1"}
                    controls={true}
                    onLoad={() => setLoading(false)}
                />
            }
            {
                (assetType(item.token) === AssetTypes.Gif) &&
                <HodlVideo
                    cid={item.token?.properties?.asset?.uri}
                    gif={true}
                    assetFolder="image"
                    onLoad={() => setLoading(false)}
                />
            }
            {
                (assetType(item.token) === AssetTypes.Audio) &&
                <HodlAudioBox token={item.token} audio={true} size={80} />
            }
        </div>
        {
            item?.metadata?.price && <PriceSticker price={item?.metadata?.price} />
        }
    </div>;

    return (
        <div>
            <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{
                    display: loading ? 'block' : 'none',
                    width: "100%",
                    paddingTop: item.token.properties.aspectRatio ? `${getTopPadding(item.token.properties.aspectRatio)}%` : '100%'
                }}
            >
            </Skeleton>
            <Box sx={{
                display: loading ? 'none' : 'block'
            }}>
                {asset}
            </Box>
        </div>)
}