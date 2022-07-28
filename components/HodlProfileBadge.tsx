import { Box, Typography } from '@mui/material';
import humanize from "humanize-plus";
import { useHodling } from '../hooks/useHodling';
import { useListed } from '../hooks/useListed';
import Link from 'next/link';
import { grey } from '@mui/material/colors';
import { useFollowingCount } from '../hooks/useFollowingCount';
import { useFollowersCount } from '../hooks/useFollowersCount';
import { User } from '../models/User';
import { UserAvatarAndHandle } from './avatar/UserAvatarAndHandle';


interface CountAndLinkProps {
    count: number;
    user: User;
    label: string;
    tab: number;
}

const CountAndLink: React.FC<CountAndLinkProps> = ({ count, user, label, tab }) => {
    return (<>
        {!isNaN(count) &&
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
    const [hodlingCount] = useHodling(user.address, 0, null, null);
    const [listedCount] = useListed(user.address, 0, null, null);

    const [followersCount] = useFollowersCount(user.address);
    const [followingCount] = useFollowingCount(user.address);

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
                <UserAvatarAndHandle user={user} size="55px" fontSize='18px' />
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
                <CountAndLink count={hodlingCount} label="Hodling" user={user} tab={0} />
                <CountAndLink count={listedCount} label="Listed" user={user} tab={1} />
                <CountAndLink count={followingCount} label="Following" user={user} tab={2} />
                <CountAndLink count={followersCount} label="Followers" user={user} tab={3} />
                {/* {!isNaN(hodlingCount) &&
                    <Link href={`/profile/${user.nickname || user.address}?tab=0`} passHref>
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
                            <span>{humanize.compactInteger(hodlingCount, 1)}</span>
                            Hodling
                        </Typography>

                    </Link>
                }
                {!isNaN(listedCount) &&
                    <Link href={`/profile/${user.nickname || user.address}?tab=1`} passHref>
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
                            <span>{humanize.compactInteger(listedCount, 1)}</span> Listed
                        </Typography>
                    </Link>
                }
                {!isNaN(followingCount) &&
                    <Link href={`/profile/${user.nickname || user.address}?tab=2`} passHref>
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
                            <span>{humanize.compactInteger(followingCount, 1)}</span> Following
                        </Typography>
                    </Link>
                }
                {!isNaN(followersCount) &&
                    <Link href={`/profile/${user.nickname || user.address}?tab=3`} passHref>
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
                            <span>{humanize.compactInteger(followersCount, 1)}</span> Followers
                        </Typography>
                    </Link>
                } */}
            </Box>

        </Box>
    )
}