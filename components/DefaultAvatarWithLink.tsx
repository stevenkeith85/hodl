import {
    Link
} from "@mui/material";
import axios from 'axios';
import useSWR from 'swr';
import { DefaultAvatar } from './DefaultAvatar';
import { NoSsr } from "@mui/material";

interface DefaultAvatarWithLinkProps {
    profileAddress: string;
    size: number;
    color: "primary" | "secondary" | "greyscale";
}

export const DefaultAvatarWithLink: React.FC<DefaultAvatarWithLinkProps> = ({ profileAddress, size, color }) => {

    const { data: profileNickname } = useSWR(profileAddress ? [`/api/profile/nickname`, profileAddress] : null,
        (url, query) => axios.get(`${url}?address=${query}`).then(r => r.data.nickname),
        { revalidateOnMount: true }
    )

    return (
        <NoSsr>
        {/* {
            profileNickname ?
                <Link href ={`/profile/${profileNickname}`}>
                    <DefaultAvatar size={size} color={color} />
                </Link>
            :
            <Link href={`/profile/${profileAddress}`}>
                <DefaultAvatar size={size} color={color} />
            </Link>
        } */}
        </NoSsr>
    )
}