import { Box, Typography } from '@mui/material';
import humanize from "humanize-plus";
import Link from 'next/link';
import { grey } from '@mui/material/colors';
import { User } from '../models/User';
import { UserAvatarAndHandle } from './avatar/UserAvatarAndHandle';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';


interface CountAndLinkProps {
    count: number;
    user: User;
    label: string;
    tab: number;
}

const CountAndLink: React.FC<CountAndLinkProps> = ({ count, user, label, tab }) => {
    if (count === null) {
        return null;
    }

    return (<>
        { 
            <Link href={`/profile/${user.nickname || user.address}?tab=${tab}`} passHref>
                <Typography
                    component="a"
                    sx={{
                        color: grey[700],
                        textDecoration: 'none',
                        span: {
                            fontWeight: 600,
                            display: 'block'
                        }
                    }}>
                    <span>{humanize.compactInteger(count, 1)}</span>
                    {label}
                </Typography>
            </Link>
        }
    </>)
}

interface HodlProfileBadgeProps {
    user: User;
}

export const HodlProfileBadge: React.FC<HodlProfileBadgeProps> = ({ user }) => {
    const { hodlingCount, listedCount, followersCount, followingCount } = useContext(UserContext);

    return (
        <Box
            display="flex"
            flexDirection={"column"}
            justifyContent="space-evenly"
            alignItems={"start"}
            sx={{
                gap: 2.5,
                paddingX: 2,
                paddingY: 2,
                border: '1px solid #ddd',
                borderRadius: 1,
            }}
        >
            <Box
                alignItems="center"
                justifyContent={"flex-start"}
                display="flex"
                flexDirection="row"
                flexGrow={1}
                gap={2}
            >
                <UserAvatarAndHandle 
                    address={user.address} 
                    fallbackData={user} 
                    size={44}
                    fontSize='18px' 
                />
            </Box>

            <Box
                display="grid"
                gridTemplateColumns="1fr 1fr 1fr 1fr"
                sx={{
                    width: '100%',
                    paddingX: 1,
                    gap: 2
                }}
            >
                <CountAndLink count={hodlingCount} label="hodling" user={user} tab={0} />
                <CountAndLink count={listedCount} label="listed" user={user} tab={1} />
                <CountAndLink count={followingCount} label="following" user={user} tab={2} />
                <CountAndLink count={followersCount} label="followers" user={user} tab={3} />
            </Box>
        </Box>
    )
}