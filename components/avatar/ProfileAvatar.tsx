import {Stack} from "@mui/material";
import useSWR from "swr";
import axios from 'axios';
import { ProfileNameOrAddress } from "./ProfileNameOrAddress";
import { DefaultAvatar } from "./DefaultAvatar";
import { DefaultAvatarWithLink } from "./DefaultAvatarWithLink";
import { NftAvatarMemo } from "./NftAvatar";
import { NftAvatarWithLinkMemo } from "./NftAvatarWithLink";


interface ProfileAvatarProps {
    profileAddress: string;
    reverse?: boolean;
    size?: "xsmall" | "small" | "medium" | "large" | "xlarge";
    color?: "primary" | "secondary" | "greyscale";
    showNickname?: boolean;
    withLink?: boolean;
    highlight?: boolean;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
    profileAddress,
    reverse = false,
    size = "medium",
    color = "secondary",
    showNickname = true,
    withLink = true,
    highlight=false,
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
            { token && withLink && <NftAvatarWithLinkMemo token={token} size={getSize()} profileAddress={profileAddress} highlight={highlight} color={color}/> }
            { token && !withLink && <NftAvatarMemo token={token} size={getSize()} highlight={highlight} color={color}/> }            
            { !token && withLink && <DefaultAvatarWithLink size={getSize()} color={color} profileAddress={profileAddress} /> }
            { !token && !withLink && <DefaultAvatar size={getSize()} color={color} /> }
            {showNickname && <ProfileNameOrAddress color={color} profileAddress={profileAddress} size={size} />}
        </Stack>
    )
}
