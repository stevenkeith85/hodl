import { HodlActionViewModel } from "../../models/HodlAction";
import { HodlImage } from "../HodlImage";
import { assetType } from "../../lib/utils";
import { AssetTypes } from "../../models/AssetType";
import { HodlVideo } from "../HodlVideo";


interface FeedAssetProps {
    item: HodlActionViewModel
}

export const FeedAsset: React.FC<FeedAssetProps> = ({ item }) => {
    return (<>
        {
            (assetType(item.token) === AssetTypes.Image) &&
            <HodlImage
                cid={item.token.image}
                effect={item.token.filter}
                sx={{ img: { borderRadius: 0, verticalAlign: 'middle' } }}
                loading="eager"
                sizes="(max-width:599px) 600px, (max-width:899px) 900px, 700px"
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