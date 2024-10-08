import { FC, memo, useContext, useLayoutEffect, useRef } from "react";

import Link from "next/link";
import dynamic from 'next/dynamic';

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NoSsr from "@mui/material/NoSsr";

import formatDistanceStrict from "date-fns/formatDistanceStrict";

import { ActionTypes, HodlActionViewModel } from "../../models/HodlAction";


import { insertTagLinks } from "../../lib/templateUtils";

import { FeedAsset } from "./FeedAsset";

import TokenActionBoxLoading from "../nft/TokenActionBoxLoading";
import Skeleton from "@mui/material/Skeleton";
import { SignedInContext } from "../../contexts/SignedInContext";


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
        loading: () => <Skeleton variant="text" animation="wave" width={50} />
    }
);

interface FeedItemActionProps{
    action: ActionTypes;
    price: string;
}
export const FeedItemAction: FC<FeedItemActionProps> = memo(({action, price}) => (<>
    {action === ActionTypes.Listed &&
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
    {action === ActionTypes.Bought &&
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
                price &&
                <MaticPrice
                    price={price}
                    color="black"
                    size={14}
                    fontSize={14}
                />
            }
        </Box>
    }
    {action === ActionTypes.Delisted &&
        <Box
            sx={{
                textAlign: 'right',
                fontFamily: theme => theme.logo.fontFamily,
                color: theme => theme.palette.secondary.main
            }}>
            delisted
        </Box>
    }
    </>
));
FeedItemAction.displayName = "FeedItemAction"

interface FeedItemBodyProps {
    action: ActionTypes;
    id: number;
    name: string;
    description: string;
}
export const FeedItemBody: FC<FeedItemBodyProps> = memo(({ action, id, name, description }) => (
    <div>
        <Link href={action === ActionTypes.Listed ? `/nft/${id}?tab=1` : `/nft/${id}`}>
            <Typography
                sx={{ 
                    fontWeight: 600,
                    marginBottom: 0.5
                    }}>
                {name}
            </Typography>
        </Link>
        <Box 
            sx={{ 
                whiteSpace: 'pre-line',
                color: theme => theme.palette.text.secondary
            }}>
            {
                insertTagLinks(description)
            }
        </Box>
    </div>
));

FeedItemBody.displayName = "FeedItemBody"

interface HodlFeedItemProps {
    item: HodlActionViewModel;
}

export const HodlFeedItem: FC<HodlFeedItemProps> = ({ item }) => {
    const { signedInAddress: address } = useContext(SignedInContext);

    if (!item) {
        return null;
    }

    return (
        <Box sx={{ paddingBottom: 3}}>
            {
                <Box
                    className={`feedItem`}
                    display="flex"
                    flexDirection="column"
                    sx={{
                        gap: 2,
                        borderRadius: 1,
                        padding: {
                            xs: 1.5,
                            sm: 2
                        },
                        // boxShadow: '1px 1px 8px #eee',
                        border: "1px solid #eee",
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
                                address={item?.subject}
                                handle={false}
                                fallbackData={item?.user}
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
                                   <FeedItemAction action={item.action} price={item?.metadata?.price}/>
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
                    <FeedItemBody
                        action={item.action}
                        description={item.token.description}
                        id={item.token.id}
                        name={item.token.name}
                    />
                </Box>}
        </Box>
    )
}