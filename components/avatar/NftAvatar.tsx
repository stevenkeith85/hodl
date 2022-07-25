import { Avatar } from "@mui/material";
import { HodlImage } from "../HodlImage";
import { HodlVideo } from "../HodlVideo";
import { memo } from "react";

export const NftAvatar = ({ token, size, highlight = false, color = "greyscale" }: any) => {
    const isGif = mimeType => mimeType && mimeType.indexOf('gif') !== -1;
    const isImage = mimeType => mimeType && mimeType.indexOf('image') !== -1;
    const isVideo = mimeType => mimeType && mimeType.indexOf('video') !== -1;
    const isUnknown = mimeType => !mimeType;

    return (
        <Avatar
            className="avatar"
            sx={{
                border: highlight ? '2px solid' : 'none',
                borderColor: highlight ? 
                    color === 'greyscale' ? 
                    'white' : theme => theme.palette[color].main : 
                'none',
                height: size,
                width: size,
            }}>
            {((isImage(token.mimeType) && !isGif(token.mimeType)) || isUnknown(token.mimeType)) &&
                <HodlImage
                    cid={token?.image.split('//')[1] || token?.image}
                    effect={token?.filter ? `${token.filter},ar_1.0,c_fill,r_max,g_face` : `ar_1.0,c_fill,r_max,g_face`}
                    height={size}
                    srcSetSizes={[Math.ceil(size), Math.ceil(size * 1.5), Math.ceil(size * 2), Math.ceil(size * 2.5)]} // we want it big enough for the scale effect
                    sizes=""
                />
            }
            {isImage(token.mimeType) && isGif(token.mimeType) &&
                <HodlVideo
                    gif={true}
                    cid={token?.image.split('//')[1] || token?.image}
                    transformations={`w_${size * 2.5},h_${size * 2.5}${token?.filter ? ',' + token.filter : ''},ar_1.0,c_fill,r_max`}

                />
            }
            {isVideo(token.mimeType) &&
                <HodlVideo
                    controls={false}
                    cid={token?.image.split('//')[1] || token?.image}
                    transformations={`w_${size * 2.5},h_${size * 2.5}${token?.filter ? ',' + token.filter : ''},ar_1.0,c_fill,r_max`}
                    onlyPoster={true}
                />
            }

        </Avatar>
    )
}
export const NftAvatarMemo = memo(NftAvatar, (prev: any, next: any) => prev.size === next.size && prev.token.tokenId === next.token.tokenId);
