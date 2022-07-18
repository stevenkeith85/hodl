import { Box, Tooltip, Typography } from '@mui/material';
import { ProfileAvatar } from '../components';
import humanize from "humanize-plus";
import { useFollowers } from '../hooks/useFollowers';
import { useFollowing } from '../hooks/useFollowing';
import { useHodling } from '../hooks/useHodling';
import { useListed } from '../hooks/useListed';
import useSWR from 'swr';
import axios from 'axios'
import Link from 'next/link';
import { truncateText, getShortAddress } from '../lib/utils';
import { FollowButton } from './profile/FollowButton';
import { grey } from '@mui/material/colors';

export const HodlProfileBadge = ({ address, minimized = false }) => {
    const [hodlingCount] = useHodling(address, 0, null, null);
    const [listedCount] = useListed(address, 0, null, null);
    const [followersCount] = useFollowers(address, null, null);
    const [followingCount, following] = useFollowing(address, null, null);

    const { data: profileNickname } = useSWR(address ? [`/api/profile/nickname`, address] : null,
        (url, query) => axios.get(`${url}?address=${query}`).then(r => r.data.nickname),
        { revalidateOnMount: true }
    )

    return (
        <Box
            display="flex"
            flexDirection={minimized ? "row" : "column"}
            justifyContent="space-evenly"
            alignItems={minimized ? "center" : "start"}
            sx={{
                gap: 2,
                paddingX: minimized ? 0 : 2,
                paddingY: minimized ? 0.5 : 2,
                border: minimized ? 'none' : '1px solid #ddd',
                borderRadius: 1,
                boxShadow: minimized ? 'none': '0 0 2px 1px #eee'
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
                <ProfileAvatar profileAddress={address} size={minimized ? "small" : "medium"} showNickname={false} />

                {profileNickname ?
                    <Link href={`/profile/${profileNickname}`}>
                        <Tooltip title={address}>
                            <Typography
                                sx={{
                                    fontSize: '18px',
                                    color: grey[700],
                                    cursor: 'pointer'
                                }}>
                                {truncateText(profileNickname, 20)}
                            </Typography>
                        </Tooltip>
                    </Link>
                    :
                    <Link href={`/profile/${address}`}>
                        <Tooltip title={address}>
                            <Typography
                                sx={{
                                    fontSize: '16px',
                                    color: grey[700],
                                    cursor: 'pointer'
                                }}>
                                {getShortAddress(address)?.toLowerCase()}
                            </Typography>
                        </Tooltip>
                    </Link>
                }

            </Box>
            {!minimized &&
                <Box
                    display="grid"
                    gridTemplateColumns="1fr 1fr 1fr 1fr"
                    sx={{
                        width: '100%',
                        paddingX: 1,
                        gap: 2
                    }}
                >
                    {!isNaN(hodlingCount) &&
                        <Link href={`/profile/${profileNickname || address}?tab=0`} passHref>
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
                        <Link href={`/profile/${profileNickname || address}?tab=1`} passHref>
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
                        <Link href={`/profile/${profileNickname || address}?tab=2`} passHref>
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
                        <Link href={`/profile/${profileNickname || address}?tab=3`} passHref>
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
                    }
                </Box>
            }
            <Box>
                <FollowButton profileAddress={address} variant={'outlined'}/>
            </Box>

        </Box>
    )
}