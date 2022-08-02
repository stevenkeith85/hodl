import { Box, Tooltip, Typography } from '@mui/material';
import axios from 'axios';
import { FC } from 'react';
import useSWR from 'swr';
import { getShortAddress, truncateText } from '../../lib/utils';
import Link from 'next/link';

interface ProfileNameOrAddressProps {
    profileAddress: string;
    fontSize?: string;
    color?: string;
    sx?: object | null;
}

export const ProfileNameOrAddress: FC<ProfileNameOrAddressProps> = ({ 
    profileAddress, 
    fontSize="14px", 
    color="inherit", 
    sx = null 
}) => {

    const { data: profileNickname } = useSWR(profileAddress ? [`/api/profile/nickname`, profileAddress] : null,
        (url, query) => axios.get(`${url}?address=${query}`).then(r => r.data.nickname)
    )

    return (<Box
        component="span"
        sx={{
            a: {
                fontSize,
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