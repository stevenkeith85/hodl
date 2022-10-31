import { FC } from 'react';
import { getShortAddress } from '../../lib/utils';
import Link from 'next/link';
import { UserViewModel } from '../../models/User';
import { useUser } from '../../hooks/useUser';
import theme from '../../theme';
import { truncateText } from '../../lib/truncateText';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

interface ProfileNameOrAddressProps {
    profileAddress: string;
    fontSize?: string;
    color?: "primary" | "secondary" | "inherit";
    sx?: object | null;
    fallbackData?: UserViewModel | null;
    you?: boolean; // use the word 'you' instead of the 3rd party form (address/nickname)
}

export const ProfileNameOrAddress: FC<ProfileNameOrAddressProps> = ({
    profileAddress,
    color = "inherit",
    sx = null,
    fallbackData = null,
    you = false
}) => {

    const { data: user } = useUser(profileAddress, fallbackData);
    if (!user) {
        return null;
    }

    const getColor = (color) => {
        if (color === "inherit") {
            return 'inherit';
        }

        return theme.palette[color].main;
    }

    return (<Box
        component="span"
        sx={{
            a: {
                textDecoration: 'none',
                color: getColor(color),
                cursor: 'pointer'
            },
            ...sx
        }}>
        {user.nickname ?
            <Link href={`/profile/${user.nickname}`} passHref>
                <Typography color={color}>{you ? 'You' : truncateText(user.nickname, 20)}</Typography>
            </Link>
            :
            <Link href={`/profile/${user.address}`} passHref>
                <Tooltip title={user.address} arrow placement="right">
                    <Typography color={color}>{getShortAddress(user.address)}</Typography>
                </Tooltip>
            </Link >

        }
    </Box >)
}