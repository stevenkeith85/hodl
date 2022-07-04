import { Link } from '@mui/material';
import axios from 'axios';
import { FC } from 'react';
import useSWR from 'swr';

import { NoSsr } from "@mui/material";
import { AvatarText } from './AvatarText';
import { getShortAddress, truncateText } from '../lib/utils';

interface ProfileNameOrAddressProps {
    profileAddress: string;
    size: "small" | "medium" | "large";
    color: string;
}

export const ProfileNameOrAddress: FC<ProfileNameOrAddressProps> = ({ profileAddress, size, color }) => {

    const { data: profileNickname } = useSWR(profileAddress ? [`/api/profile/nickname`, profileAddress] : null,
        (url, query) => axios.get(`${url}?address=${query}`).then(r => r.data.nickname),
        { revalidateOnMount: true }
    )

    return (<NoSsr>
        {profileNickname ?
            <Link href={`/profile/${profileNickname}`}>
                foo
                {/* <AvatarText size={size} color={color}>{truncateText(profileNickname, 20)}</AvatarText> */}
            </Link> :
            <Link href={`/profile/${profileAddress}`}>
                bar
                {/* <AvatarText size={size} color={color}>{getShortAddress(profileAddress)}</AvatarText> */}
            </Link>
        }
    </NoSsr>)
}