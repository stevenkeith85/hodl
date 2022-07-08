import Link from "next/link";
import {Avatar, Stack} from "@mui/material";
import useSWR from "swr";
import { HodlImage } from "../HodlImage";
import { HodlVideo } from "../HodlVideo";
import { memo } from "react";
import axios from 'axios';
import { ProfileNameOrAddress } from "./ProfileNameOrAddress";
import { DefaultAvatar } from "./DefaultAvatar";
import { DefaultAvatarWithLink } from "./DefaultAvatarWithLink";



export const NftAvatarWithLink = ({ token, size, highlight = false }: any) => (
    <Link href={`/nft/${token.tokenId}`} passHref>
        <a>
            <NftAvatar token={token} size={size} highlight={highlight} />
        </a>
    </Link>
)
export const NftAvatarWithLinkMemo = memo(NftAvatarWithLink, (prev: any, next: any) => prev.size === next.size && prev.token.tokenId === next.token.tokenId);

export const NftAvatar = ({ token, size, highlight = false }: any) => {
    const isGif = mimeType => mimeType && mimeType.indexOf('gif') !== -1;
    const isImage = mimeType => mimeType && mimeType.indexOf('image') !== -1;
    const isVideo = mimeType => mimeType && mimeType.indexOf('video') !== -1;
    const isUnknown = mimeType => !mimeType;

    return (
        <Avatar
            className="avatar"
            sx={{
                border: highlight ? '2px solid' : 'none',
                borderColor: highlight ? theme => theme.palette.secondary.main : 'none',
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

interface ProfileAvatarProps {
    profileAddress: string;
    reverse?: boolean;
    size?: "xsmall" | "small" | "medium" | "large";
    color?: "primary" | "secondary" | "greyscale";
    showNickname?: boolean;
    withLink?: boolean;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
    profileAddress,
    reverse = false,
    size = "medium",
    color = "secondary",
    showNickname = true,
    withLink = true
}) => {
    const { data: tokenId } = useSWR(
        profileAddress ? [`/api/profile/picture`, profileAddress] : null,
        (url, query) => axios.get(`${url}?address=${query}`).then(r => r.data.token),
        { revalidateOnMount: true }
    )

    const { data: token } = useSWR(
        tokenId ? [`/api/token`, tokenId] : null,
        (url, query) => axios.get(`${url}/${query}`).then(r => r.data.token),
        { revalidateOnMount: true }
    )


    const getSize = () => {
        const mappings = {
            xsmall: 36,
            small: 44,
            medium: 54,
            large: 70,
            xlarge: 100
        }

        return mappings[size];
    }

    return (
        <Stack sx={{
            alignItems: "center",
            cursor: 'pointer',
        }}
            spacing={size === 'small' ? 1 : 2}
            direction={reverse ? 'row-reverse' : 'row'}
        >
            { token && withLink && <NftAvatarWithLinkMemo token={token} size={getSize()} /> }
            { token && !withLink && <NftAvatarMemo token={token} size={getSize()} /> }
            
            { !token && withLink && <DefaultAvatarWithLink size={getSize()} color={color} profileAddress={profileAddress} /> }
            { !token && !withLink && <DefaultAvatar size={getSize()} color={color} /> }
            {showNickname && <ProfileNameOrAddress color={color} profileAddress={profileAddress} size={size} />}


        </Stack>
    )
}
