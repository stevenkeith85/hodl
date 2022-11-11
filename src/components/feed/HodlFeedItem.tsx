import { FC, useContext } from "react";

import Link from "next/link";
import dynamic from 'next/dynamic';

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NoSsr from "@mui/material/NoSsr";

import formatDistanceStrict from "date-fns/formatDistanceStrict";

import { WalletContext } from "../../contexts/WalletContext";
import { ActionTypes, HodlActionViewModel } from "../../models/HodlAction";


import { insertTagLinks } from "../../lib/templateUtils";

import { FeedAsset } from "./FeedAsset";

import TokenActionBoxLoading from "../nft/TokenActionBoxLoading";
import Skeleton from "@mui/material/Skeleton";


const TokenActionBox = dynamic(
    () => import('../nft/TokenActionBox'),
    {
        ssr: false,
        loading: () => <TokenActionBoxLoading />
    }
);

const MaticPrice = dynamic(
    () => import('../MaticPrice').then(mod => mod.MaticPrice),
    {
        ssr: false,
        loading: () => null
    }
);

const UserAvatarAndHandle = dynamic(
    () => import('../avatar/UserAvatarAndHandle').then(mod => mod.UserAvatarAndHandle),
    {
        ssr: false,
        loading: () => <Skeleton variant="circular" animation="wave" width={44} height={44} />
    }
);

const ProfileNameOrAddress = dynamic(
    () => import('../avatar/ProfileNameOrAddress').then(mod => mod.ProfileNameOrAddress),
    {
        ssr: false,
        loading: () => <Skeleton variant="text" animation="wave" width={50}  />
    }
);

interface HodlFeedItemProps {
    item: HodlActionViewModel;
}

export const HodlFeedItem: FC<HodlFeedItemProps> = ({ item }) => {
    const { address } = useContext(WalletContext);

    return (
        <>
            {
                <Box
                    className={'feedItem'}
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    sx={{
                        borderRadius: 1,
                        padding:
                        {
                            xs: 1.5,
                            sm: 2
                        },
                        border: `1px solid #ddd`,
                        background: 'white'
                    }
                    }
                >
                    <Box
                        display="flex"
                        flexDirection="column"
                        gap={2}
                        sx={{ width: '100%' }}
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            gap={1.5}
                        >
                            <UserAvatarAndHandle
                                address={item.subject}
                                handle={false}
                                fallbackData={item.user}
                            />
                            <Box
                                flexGrow={1}
                                sx={{
                                    cursor: 'pointer',
                                    textDecoration: 'none'
                                }}>
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    width="100%"
                                    alignItems="center"
                                >
                                    <Box display="flex" flexDirection="column" component="span">
                                        {item?.subject && item?.subject !== address &&
                                            <ProfileNameOrAddress
                                                color={"primary"}
                                                profileAddress={item.subject}
                                                fallbackData={item.user}
                                                fontWeight={600}
                                            />}
                                        {item?.subject && item?.subject === address &&
                                            <Typography component="span" sx={{ fontWeight: 600 }}>You</Typography>
                                        }
                                        <NoSsr>
                                            <Typography component="span" sx={{ fontSize: 10, color: "#999" }}>
                                                {item.timestamp && formatDistanceStrict(new Date(item.timestamp), new Date(), { addSuffix: true })}
                                            </Typography>
                                        </NoSsr>
                                    </Box>
                                    {item.action === ActionTypes.Listed &&
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                textAlign: 'right',
                                                fontFamily: theme => theme.logo.fontFamily,
                                                color: theme => theme.palette.secondary.main
                                            }}>
                                            <Typography>listed</Typography>
                                        </Box>
                                    }
                                    {item.action === ActionTypes.Bought &&
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                textAlign: 'right',
                                                fontFamily: theme => theme.logo.fontFamily,
                                                color: theme => theme.palette.secondary.main
                                            }}>
                                            <Typography>sold</Typography>
                                            {
                                                item?.metadata?.price &&
                                                <MaticPrice
                                                    price={item?.metadata?.price}
                                                    color="black"
                                                    size={14}
                                                    fontSize={14}
                                                />
                                            }
                                        </Box>
                                    }
                                    {item.action === ActionTypes.Delisted &&
                                        <Box
                                            sx={{
                                                textAlign: 'right',
                                                fontFamily: theme => theme.logo.fontFamily,
                                                color: theme => theme.palette.secondary.main
                                            }}>
                                            delisted
                                        </Box>
                                    }
                                    {item.action === ActionTypes.Added &&
                                        <Box
                                            sx={{
                                                textAlign: 'right',
                                                fontFamily: theme => theme.logo.fontFamily,
                                                color: theme => theme.palette.primary.main,
                                                fontSize: {
                                                    xs: 12,
                                                    sm: 14
                                                }
                                            }}>
                                            new
                                        </Box>
                                    }
                                </Box>
                            </Box>
                        </Box>
                        {
                            item.token?.properties?.asset?.uri &&
                            <Link
                                href={
                                    item.action === ActionTypes.Listed ?
                                        `/nft/${item.token.id}?tab=1` :
                                        `/nft/${item.token.id}`
                                }
                            >
                                <Box
                                    sx={{
                                        height: '100%',
                                        lineHeight: 0,
                                        cursor: 'pointer',
                                        marginX: {
                                            xs: -1.5,
                                            sm: -2
                                        }
                                    }}>
                                    <FeedAsset item={item} />
                                </Box>
                            </Link>
                        }
                    </Box>
                    {item.token && <div style={{ height: '20px' }}>
                        <TokenActionBox 
                            nft={item?.token} 
                            popUp={true} 
                            prefetchedLikeCount={item?.token?.likeCount}
                            prefetchedCommentCount={item?.token?.commentCount}
                        />
                    </div>
                    }
                    <div>
                        <Link
                            href={
                                item.action === ActionTypes.Listed ?
                                    `/nft/${item.token.id}?tab=1` :
                                    `/nft/${item.token.id}`
                            }
                        >
                            <Typography
                                sx={{
                                    fontWeight: 600
                                }}>
                                {item.token?.name}
                            </Typography>
                        </Link>
                        <Box
                            sx={{
                                whiteSpace: 'pre-line'
                            }}>
                            {
                                insertTagLinks(item.token?.description)
                            }
                        </Box>
                    </div>
                </Box>}
        </>
    )
}
