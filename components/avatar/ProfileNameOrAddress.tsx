import { Box, Tooltip, Typography } from '@mui/material';
import axios from 'axios';
import { FC } from 'react';
import useSWR, { Fetcher } from 'swr';
import { getShortAddress, truncateText } from '../../lib/utils';
import Link from 'next/link';
import { User } from '../../models/User';
import { useUser } from '../../hooks/useUser';

interface ProfileNameOrAddressProps {
    profileAddress: string;
    fontSize?: string;
    color?: string;
    sx?: object | null;
    fallbackData?: User | null;
}

export const ProfileNameOrAddress: FC<ProfileNameOrAddressProps> = ({ 
    profileAddress, 
    fontSize="14px", 
    color="inherit", 
    sx = null,
    fallbackData=null
}) => {

    const user: User = useUser(profileAddress, fallbackData);
    if (!user) {
        return null;
    }

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
        {user.nickname ?
            <Link href={`/profile/${user.nickname}`}>
                <Tooltip title={profileAddress} arrow placement="right">
                    <a>
                        {truncateText(user.nickname, 20)}
                    </a>
                </Tooltip>
            </Link>
            :
            <Link href={`/profile/${user.address}`}>
                <Tooltip title={user.address} arrow placement="right">
                    <a>{getShortAddress(user.address)}</a>
                </Tooltip>
            </Link >

        }
    </Box >)
}