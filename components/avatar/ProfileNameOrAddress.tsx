import { Box, Tooltip, Typography } from '@mui/material';
import axios from 'axios';
import { FC } from 'react';
import useSWR, { Fetcher } from 'swr';
import { getShortAddress, truncateText } from '../../lib/utils';
import Link from 'next/link';
import { User } from '../../models/User';
import { useUser } from '../../hooks/useUser';
import theme from '../../theme';

interface ProfileNameOrAddressProps {
    profileAddress: string;
    fontSize?: string;
    color?: "primary" | "secondary" | "inherit";
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

    const {data: user } = useUser(profileAddress, fallbackData);
    if (!user) {
        return null;
    }

    const getColor = (color) => {
        if (color === "inherit") {
            return theme.palette.text.primary;
        }

        return theme.palette[color].main;
    }

    return (<Box
        component="span"
        sx={{
            fontSize,
            a: {
                fontSize,
                textDecoration: 'none',
                color: getColor(color),
                cursor: 'pointer'
            },
            ...sx
        }}>
        {user.nickname ?
            <Link href={`/profile/${user.nickname}`} passHref>
                {/* <Tooltip title={profileAddress} arrow placement="right"> */}
                    <a>
                        {truncateText(user.nickname, 20)}
                    </a>
                {/* </Tooltip> */}
            </Link>
            :
            <Link href={`/profile/${user.address}`} passHref>
                <Tooltip title={user.address} arrow placement="right">
                    <a>{getShortAddress(user.address)}</a>
                </Tooltip>
            </Link >

        }
    </Box >)
}