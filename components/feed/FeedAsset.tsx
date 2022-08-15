import { HodlActionViewModel } from "../../models/HodlAction";
import { HodlImage } from "../HodlImage";
import { assetType } from "../../lib/utils";
import { AssetTypes } from "../../models/AssetType";
import { HodlVideo } from "../HodlVideo";
import { HodlImageResponsive } from "../HodlImageResponsive";
import { Box, Skeleton } from "@mui/material";
import { useState } from "react";


interface FeedAssetProps {
    item: HodlActionViewModel
}

export const FeedAsset: React.FC<FeedAssetProps> = ({ item }) => {
    return (<Box
        sx={{ 
            position: 'relative', 
        }}>
        {/* <Skeleton 
            width={575} 
            height={575} variant="rectangular" sx={{ zIndex: -1, position: 'absolute', top: 0, left: 0 }} /> */}
        {
            (assetType(item.token) === AssetTypes.Image) &&
            <HodlImageResponsive
                cid={item.token.image}
                aspectRatio={item?.token?.aspectRatio || "1:1"}
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
    </Box>)
}