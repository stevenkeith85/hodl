import { Box, Typography } from '@mui/material';
import humanize from "humanize-plus";
import Link from 'next/link';
import { grey } from '@mui/material/colors';
import { User, UserViewModel } from '../models/User';
import { UserAvatarAndHandle } from './avatar/UserAvatarAndHandle';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { ProfileNameOrAddress } from './avatar/ProfileNameOrAddress';
import { CopyText } from './CopyAddress';
import { HodlBorderedBox } from './HodlBorderedBox';
import { getShortAddress } from '../lib/utils';


interface CountAndLinkProps {
    count: number;
    user: UserViewModel;
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
    user: UserViewModel;
}

export const HodlProfileBadge: React.FC<HodlProfileBadgeProps> = ({ user }) => {
    const { hodlingCount, listedCount, followersCount, followingCount } = useContext(UserContext);

    return (
        <HodlBorderedBox
            sx={{
                width: `100%`,
            }}
        >
            <Box
                display="flex"
                flexDirection={"column"}
                justifyContent="space-evenly"
                alignItems={"start"}
                sx={{
                    gap: 3,
                }}
            >
                <Box
                    display="flex"
                    gap={3}
                    alignItems={"center"}
                >
                    <UserAvatarAndHandle
                        address={user.address}
                        fallbackData={user}
                        size={70}
                        handle={false}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                        }}>
                        <ProfileNameOrAddress profileAddress={user.address} fallbackData={user} fontSize="20px" />
                        <CopyText owner={user}>
                            <Typography sx={{ fontSize: 14 }}>{getShortAddress(user.address)}</Typography>
                        </CopyText>
                    </Box>

                </Box>


                <Box
                    display="grid"
                    gridTemplateColumns="1fr 1fr 1fr 1fr"
                    sx={{
                        width: '100%',
                        gap: 1
                    }}
                >
                    <CountAndLink count={hodlingCount} label="hodling" user={user} tab={0} />
                    <CountAndLink count={listedCount} label="listed" user={user} tab={1} />
                    <CountAndLink count={followingCount} label="following" user={user} tab={2} />
                    <CountAndLink count={followersCount} label="followers" user={user} tab={3} />
                </Box>
            </Box>
        </HodlBorderedBox>
    )
}