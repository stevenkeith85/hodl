import { HodlActionViewModel } from "../../models/HodlAction";
import { HodlImage } from "../HodlImage";
import { assetType } from "../../lib/utils";
import { AssetTypes } from "../../models/AssetType";
import { HodlVideo } from "../HodlVideo";
import { HodlImageResponsive } from "../HodlImageResponsive";


interface FeedAssetProps {
    item: HodlActionViewModel
}

export const FeedAsset: React.FC<FeedAssetProps> = ({ item }) => {
    return (<>
        {
            (assetType(item.token) === AssetTypes.Image) &&
            <HodlImageResponsive
                cid={item.token.image}
                aspectRatio="1:1"
                gravity="g_face"
                widths={[575, 1080]}
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
    </>)
}