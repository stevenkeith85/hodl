
import axios from 'axios';
import useSWR from 'swr';
import { DefaultAvatar } from './DefaultAvatar';
import Link from 'next/link';
import { NoSsr } from "@mui/material";

interface DefaultAvatarWithLinkProps {
    profileAddress: string;
    size: number;
    color: "primary" | "secondary" | "greyscale";
}

export const DefaultAvatarWithLink: React.FC<DefaultAvatarWithLinkProps> = ({ profileAddress, size, color }) => {

    const { data: profileNickname } = useSWR(profileAddress ? [`/api/profile/nickname`, profileAddress] : null,
        (url, query) => axios.get(`${url}?address=${query}`).then(r => r.data.nickname)
    )

    return (<>
        {
            profileNickname ?
                <Link href ={`/profile/${profileNickname}`} passHref>
                    <a>
                        <DefaultAvatar size={size} color={color} />
                    </a>
                    
                </Link>
            :
            <Link href={`/profile/${profileAddress}`} passHref>
                <a>
                <DefaultAvatar size={size} color={color} />
                </a>
            </Link>
        }
    </>)
}