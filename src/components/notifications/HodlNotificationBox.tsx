import dynamic from 'next/dynamic';
import { FC, memo, useContext } from "react";

import Link from "next/link";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import formatDistanceStrict from "date-fns/formatDistanceStrict";

import { ActionTypes, HodlActionViewModel } from "../../models/HodlAction";

import { MaticPrice } from "../MaticPrice";

import { truncateText } from "../../lib/truncateText";
import Skeleton from "@mui/material/Skeleton";
import { FollowButtonLoading } from '../profile/FollowButtonLoading';
import { UserAvatarAndHandle } from '../avatar/UserAvatarAndHandle';
import { ProfileNameOrAddress } from '../avatar/ProfileNameOrAddress';
import { SignedInContext } from '../../contexts/SignedInContext';
import { insertProfileLinks } from '../../lib/insertProfileLinks';

const AssetThumbnail = dynamic(
    () => import('../AssetThumbnail').then(mod => mod.AssetThumbnail),
    {
        ssr: false,
        loading: () => <Skeleton variant="rectangular" animation="wave" width={44} height={44} />
    }
);

const FollowButton = dynamic(
    () => import('../profile/FollowButton').then(mod => mod.FollowButton),
    {
        ssr: false,
        loading: () => <FollowButtonLoading />
    }
);

// Boolean guards

const likedToken = item => item.action === ActionTypes.Liked && item.object === "token";
const likedDeletedComment = item => item.action === ActionTypes.Liked && item.object === "comment" && item.comment === null;
const likedComment = item => item.action === ActionTypes.Liked && item.object === "comment" && item.comment !== null;
const taggedInComment = item => item.action === ActionTypes.Tagged;
const madeDeletedComment = item => item.action === ActionTypes.Commented && item.object === "comment" && item.comment === null;
const commentedOnToken = item => item.action === ActionTypes.Commented && item.object === "comment" && item.comment && item.comment.object == "token";
const repliedToComment = item => item.action === ActionTypes.Commented && item.object === "comment" && item.comment && item.comment.object == "comment";

const mintedToken = item => item.action === ActionTypes.Added;
const listedToken = item => item.action === ActionTypes.Listed;
const delistedToken = item => item.action === ActionTypes.Delisted;
const boughtToken = item => item.action === ActionTypes.Bought;

const followed = item => item.action === ActionTypes.Followed;

// Components
const LikedToken = () => <>liked your token.</>
const LikedDeletedComment = () => <>liked your comment, that has now been deleted.</>
const LikedComment = ({ item }) => <>{insertProfileLinks(`liked your comment: ${truncateText(item?.comment?.comment, 70)}.`)}</>
const TaggedInComment = ({ item }) => <>
    mentioned you in a comment
</>
const MadeDeletedComment = () => <>commented on your token: [deleted]</>
const CommentedOnToken = ({ item }) => <>{insertProfileLinks(`commented on your token: ${truncateText(item?.comment?.comment, 70)}.`)}</>
const RepliedToComment = ({ item }) => <>{insertProfileLinks(`replied: ${truncateText(item?.comment?.comment, 70)}.`)}</>

const MintedToken = () => <>minted a token on the blockchain</>
const ListedToken = ({ item }) => <>listed a token on the market for <MaticPrice price={item?.metadata?.price} color="black" fontSize={14} size={14} sx={{ marginLeft: 0.5 }} /></>
const DelistedToken = ({ item }) => <>delisted a token from the market</>
const BoughtToken = ({ item }) => {
    const { signedInAddress: address } = useContext(SignedInContext);

    if (address === item?.metadata?.seller) {
        return <Typography component={"span"}>
            bought your token for
            <MaticPrice price={item?.metadata?.price} color="black" fontSize={14} size={14} sx={{ marginLeft: 0.5 }} />
        </Typography>
    }
    return (
        <Typography component={"span"}>
            bought a token for
            <MaticPrice price={item?.metadata?.price} color="black" fontSize={14} size={14} sx={{ marginLeft: 0.5 }} />&nbsp;
            from <ProfileNameOrAddress profileAddress={item?.metadata?.seller} />
        </Typography>
    )
}
const Followed = () => <>followed you.</>


const Timestamp = ({ item }) => {
    return (<>
        <Typography
            component="span"
            sx={{
                margin: 1,
                fontSize: 10,
                color: theme => theme.palette.text.secondary
            }}>
            {item.timestamp && formatDistanceStrict(new Date(item.timestamp), new Date(), { addSuffix: false })}
        </Typography></>)
}

const MessageWithAvatarAndTime = ({ item, children }) => {
    return (<>
        {' '}
        {children}
        <Timestamp item={item} />
    </>)
}

interface NotificationLinkProps {
    item: HodlActionViewModel;
}
const NotificationLink: React.FC<NotificationLinkProps> = ({ item }) => {
    const { signedInAddress: address } = useContext(SignedInContext);

    return (<Box
        sx={{
            width: `100%`,
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
            "& > a": {
                display: 'block',
                width: `100%`,
            },
            a: {
                color: theme => theme.palette.text.primary
            }
        }}>

        <Box component="span">
            {item?.subject &&
                <ProfileNameOrAddress
                    color={"primary"}
                    profileAddress={item.subject}
                    fallbackData={item.user}
                    fontWeight={600}
                    you={item?.subject === address}
                />}
        </Box>
        {
            likedToken(item) &&
            <Link href={`/nft/${item?.token?.id}`}>
                <MessageWithAvatarAndTime item={item}>
                    <LikedToken />
                </MessageWithAvatarAndTime>
            </Link>
        }
        {
            likedDeletedComment(item) &&
            <MessageWithAvatarAndTime item={item}>
                <LikedDeletedComment />
            </MessageWithAvatarAndTime>
        }
        {
            likedComment(item) &&
            <Link href={`/nft/${item?.comment.tokenId}?comment=${item?.comment?.id}`}>
                <MessageWithAvatarAndTime item={item}>
                    <LikedComment item={item} />
                </MessageWithAvatarAndTime>
            </Link>
        }
        {
            taggedInComment(item) &&
            <Link href={`/nft/${item?.comment.tokenId}?comment=${item?.comment?.id}`}
                >
                <MessageWithAvatarAndTime item={item}>
                    <TaggedInComment item={item} />
                </MessageWithAvatarAndTime>
            </Link>
        }
        {
            madeDeletedComment(item) &&
            <MessageWithAvatarAndTime item={item}>
                <MadeDeletedComment />
            </MessageWithAvatarAndTime>
        }
        {
            commentedOnToken(item) &&
            <Link href={`/nft/${item.comment.tokenId}?comment=${item.comment.id}`} passHref>
                <MessageWithAvatarAndTime item={item}>
                    <CommentedOnToken item={item} />
                </MessageWithAvatarAndTime>
            </Link>
        }
        {
            repliedToComment(item) &&
            <Link href={`/nft/${item?.token?.id}?comment=${item?.comment?.id}`} passHref>
                <MessageWithAvatarAndTime item={item}>
                    <RepliedToComment item={item} />
                </MessageWithAvatarAndTime>
            </Link>
        }
        {
            boughtToken(item) &&
            <Link href={`/nft/${item.token.id}`} passHref>
                <MessageWithAvatarAndTime item={item}>
                    <BoughtToken item={item} />
                </MessageWithAvatarAndTime>
            </Link>
        }
        {
            mintedToken(item) &&
            <Link href={`/nft/${item?.token?.id}`} passHref>
                <MessageWithAvatarAndTime item={item}>
                    <MintedToken />
                </MessageWithAvatarAndTime>
            </Link>
        }
        {
            listedToken(item) &&
            <Link href={`/nft/${item?.token?.id}`} passHref>
                <MessageWithAvatarAndTime item={item}>
                    <ListedToken item={item} />
                </MessageWithAvatarAndTime>
            </Link>
        }
        {
            delistedToken(item) &&
            <Link href={`/nft/${item?.token?.id}`} passHref>
                <MessageWithAvatarAndTime item={item}>
                    <DelistedToken item={item} />
                </MessageWithAvatarAndTime>
            </Link>
        }
        {
            followed(item) &&
            <Link href={`/profile/${item?.user?.nickname || item?.user?.address}`} passHref>
                <MessageWithAvatarAndTime item={item}>
                    <Followed />
                </MessageWithAvatarAndTime>
            </Link>
        }
    </Box>)
}

interface HodlNotificationBoxProps {
    item: HodlActionViewModel;
    setShowNotifications: Function;
    lastRead: number;
    sx?: object;
}
export const HodlNotificationBox: FC<HodlNotificationBoxProps> = memo(({
    item,
    setShowNotifications,
    lastRead,
    sx = {}
}) => {

    if (!item) {
        return null;
    }

    return (
        <Box key={item?.id} sx={{
            background: lastRead < item.timestamp ? "#ECF3FF" : "white",
            padding: 1,
            marginX: 0.5,
            marginY: 0.75,
            ...sx
        }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'start',
                    gap: 1,
                    justifyContent: 'space-between'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'start',
                        gap: 2,
                        width: 'calc(100% - 80px)'
                    }}
                    onClick={
                        () => setShowNotifications(false)
                    }
                >
                    <UserAvatarAndHandle
                        address={item.subject}
                        size={44}
                        handle={false}
                        fallbackData={item.user}
                    />
                    <NotificationLink item={item} />
                </Box>
                <Box
                    sx={{
                        width: '80px',
                        display: 'flex',
                        alignItems: 'start',
                        justifyContent: 'end'
                    }}
                >
                    {
                        item.token && item.token &&
                        <Link href={`/nft/${item.token.id}`}>
                            <Typography
                                sx={{
                                    display: 'block',
                                    width: 44,
                                    height: 44,
                                }}
                            >
                                <AssetThumbnail token={item.token} />
                            </Typography>
                        </Link>
                    }
                    {
                        followed(item) &&
                        <FollowButton
                            profileAddress={item.subject}
                            variant="outlined"
                            sx={{
                                paddingX: 0.75,
                                paddingY: 0.25,
                                marginY: 0.75,
                                minWidth: 0
                            }}
                        />
                    }
                </Box>
            </Box>
        </Box>
    )
}
)

HodlNotificationBox.displayName = "HodlNotificationBox"