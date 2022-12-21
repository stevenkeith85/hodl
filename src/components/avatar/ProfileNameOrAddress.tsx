import { getShortAddress } from "../../lib/getShortAddress";
import Link from 'next/link';
import { useUser } from '../../hooks/useUser';
import theme from '../../theme';
import { truncateText } from '../../lib/truncateText';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


export const ProfileNameOrAddress= ({
    profileAddress,
    fontSize = "14px",
    fontWeight = 500,
    color = "inherit",
    sx = {},
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
            <Link href={`/profile/${user.nickname}`}>
                <Typography component="span" fontSize={fontSize} fontWeight={fontWeight} color={color}>{you ? 'You' : truncateText(user.nickname, 20)}</Typography>
            </Link>
            :
            <Link href={`/profile/${user.address}`}>
                <Typography component="span" fontSize={fontSize} fontWeight={fontWeight} color={color}>{getShortAddress(user.address)}</Typography>
            </Link >
        }
    </Box >)
}