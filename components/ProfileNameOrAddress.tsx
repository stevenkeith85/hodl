import { Box } from '@mui/material';
import axios from 'axios';
import { FC } from 'react';
import useSWR from 'swr';
import { getShortAddress, truncateText } from '../lib/utils';
import Link from 'next/link';

interface ProfileNameOrAddressProps {
    profileAddress: string;
    size: "small" | "medium" | "large";
    color: string;
    sx?: object | null;
}

export const ProfileNameOrAddress: FC<ProfileNameOrAddressProps> = ({ profileAddress, size, color, sx = null }) => {

    const { data: profileNickname } = useSWR(profileAddress ? [`/api/profile/nickname`, profileAddress] : null,
        (url, query) => axios.get(`${url}?address=${query}`).then(r => r.data.nickname),
        { revalidateOnMount: true }
    )

    const mappings = {
        small: 14,
        medium: 14,
        large: 20
    }

    return (<Box
        component="span"
        sx={{
            a: {
                fontSize: mappings[size],
                textDecoration: 'none',
                color: color === 'greyscale' ? 'white' : '#000'
            },
            ...sx
        }}>
        {profileNickname ?
            <Link href={`/profile/${profileNickname}`}>
                <a>{truncateText(profileNickname, 20)}</a>
            </Link> :
            <Link href={`/profile/${profileAddress}`}>
                <a>{getShortAddress(profileAddress)}</a>
            </Link >
        }
    </Box>)
}