import { Box, Tooltip, Typography } from '@mui/material';
import axios from 'axios';
import { FC } from 'react';
import useSWR from 'swr';
import { getShortAddress, truncateText } from '../../lib/utils';
import Link from 'next/link';

interface ProfileNameOrAddressProps {
    profileAddress: string;
    size?: "xsmall" | "small" | "medium" | "large" | "xlarge";
    color?: string;
    sx?: object | null;
}

export const ProfileNameOrAddress: FC<ProfileNameOrAddressProps> = ({ profileAddress, size="xsmall", color="inherit", sx = null }) => {

    const { data: profileNickname } = useSWR(profileAddress ? [`/api/profile/nickname`, profileAddress] : null,
        (url, query) => axios.get(`${url}?address=${query}`).then(r => r.data.nickname)
    )

    const mappings = {
        xsmall: 14,
        small: 16,
        medium: 18,
        large: 20,
        xlarge: 22
    }

    return (<Box
        component="span"
        sx={{
            a: {
                fontSize: `${mappings[size]}px`,
                textDecoration: 'none',
                color: color === 'greyscale' ? 'white' : '#000'
            },
            ...sx
        }}>
        {profileNickname ?
            <Link href={`/profile/${profileNickname}`}>
                <Tooltip title={profileAddress} arrow placement="right">
                    <a>
                        {truncateText(profileNickname, 20)}
                    </a>
                </Tooltip>
            </Link>
            :
            <Link href={`/profile/${profileAddress}`}>
                <Tooltip title={profileAddress} arrow placement="right">
                    <a>{getShortAddress(profileAddress)}</a>
                </Tooltip>
            </Link >

        }
    </Box >)
}