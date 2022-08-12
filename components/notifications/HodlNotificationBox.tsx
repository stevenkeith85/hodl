import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { FC } from "react";
import { ActionTypes, HodlActionViewModel } from "../../models/HodlAction";
import { truncateText } from "../../lib/utils";
import { ProfileNameOrAddress } from '../avatar/ProfileNameOrAddress';
import { formatDistanceStrict } from "date-fns";
import { UserAvatarAndHandle } from "../avatar/UserAvatarAndHandle";
import { AssetThumbnail } from "../AssetThumbnail";
import { FollowButton } from "../profile/FollowButton";

// Boolean guards
const likedToken = item => item.action === ActionTypes.Liked && item.object === "token";
const likedDeletedComment = item => item.action === ActionTypes.Liked && item.object === "comment" && item.comment === null;
const likedComment = item => item.action === ActionTypes.Liked && item.object === "comment" && item.comment !== null;
const madeDeletedComment = item => item.action === ActionTypes.Commented && item.object === "comment" && item.comment === null;
const commentedOnToken = item => item.action === ActionTypes.Commented && item.object === "comment" && item.comment && item.comment.object == "token";
const repliedToComment = item => item.action === ActionTypes.Commented && item.object === "comment" && item.comment && item.comment.object == "comment";
const boughtToken = item => item.action === ActionTypes.Bought;
const followed = item => item.action === ActionTypes.Followed;

// Components
const LikedToken = () => <>liked a token.</>
const LikedDeletedComment = () => <>liked a comment, that has now been [deleted].</>
const LikedComment = ({ item }) => <>{`liked a comment: ${truncateText(item?.comment?.comment, 70)}.`}</>
const MadeDeletedComment = () => <>made a comment, that has now been [deleted].</>
const CommentedOnToken = ({ item }) => <>{`commented: ${truncateText(item?.comment?.comment, 70)}.`}</>
const RepliedToComment = ({ item }) => <>{`replied: ${truncateText(item?.comment?.comment, 70)}.`}</>
const BoughtToken = () => <>bought a token.</>
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
    return (<>{
        item?.subject &&
        <ProfileNameOrAddress
            color={"primary"}
            profileAddress={item.subject}
            fallbackData={item.user}
            sx={{ fontWeight: 600 }}
        />
    }
        {' '}
        {children}
        <Timestamp item={item} />
    </>)
}

const NotificationLink = ({ item }) => {
    return (<Box
        sx={{
            width: `100%`,
            "& > a": {
                display: 'block',
                width: `100%`
            }
        }}>
        {
            likedToken(item) &&
            <Link href={`/nft/${item?.token?.id}`} passHref>
                <Typography component="a">
                    <MessageWithAvatarAndTime item={item}>
                        <LikedToken />
                    </MessageWithAvatarAndTime>
                </Typography>
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
            <Link href={`/nft/${item?.token?.id}?comment=${item?.comment?.id}`} passHref>
                <Typography component="a">
                    <MessageWithAvatarAndTime item={item}>
                        <LikedComment item={item} />
                    </MessageWithAvatarAndTime>
                </Typography>
            </Link>
        }
        {
            madeDeletedComment(item) && <MessageWithAvatarAndTime item={item}>
                <MadeDeletedComment />
            </MessageWithAvatarAndTime>
        }
        {
            commentedOnToken(item) &&
            <Link href={`/nft/${item.token.id}?comment=${item.comment.id}`} passHref>
                <Typography component="a">
                    <MessageWithAvatarAndTime item={item}>
                        <CommentedOnToken item={item} />
                    </MessageWithAvatarAndTime>
                </Typography>
            </Link>
        }
        {
            repliedToComment(item) &&
            <Link href={`/nft/${item?.token?.id}?comment=${item?.comment?.id}`} passHref>
                <Typography component="a">
                    <MessageWithAvatarAndTime item={item}>
                        <RepliedToComment item={item} />
                    </MessageWithAvatarAndTime>
                </Typography>
            </Link>
        }
        {
            boughtToken(item) &&
            <Link href={`/nft/${item.token.id}`} passHref>
                <Typography component="a">
                    <MessageWithAvatarAndTime item={item}>
                        <BoughtToken />
                    </MessageWithAvatarAndTime>
                </Typography>
            </Link>
        }
        {
            followed(item) &&
            <Link href={`/profile/${item?.user?.nickname || item?.user?.address}`} passHref>
                <Typography component="a">
                    <MessageWithAvatarAndTime item={item}>
                        <Followed />
                    </MessageWithAvatarAndTime>
                </Typography>
            </Link>
        }
    </Box>)
}

interface HodlNotificationBoxProps {
    item: HodlActionViewModel;
    setShowNotifications: Function;
    lastRead: number;
}

export const HodlNotificationBox: FC<HodlNotificationBoxProps> = ({ item, setShowNotifications, lastRead }) => {

    return (
        <Box key={item?.id} sx={{
            background: lastRead < item.timestamp ? "#ECF3FF" : "none",
            padding: 1,
            marginY: 1
        }}>
            <Box
                display="flex"
                alignItems="center"
                gap={2}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    onClick={
                        () => setShowNotifications(false)
                    }
                    gap={1.5}
                    flexGrow={1}
                >
                    <UserAvatarAndHandle
                        address={item.subject}
                        size={44}
                        handle={false}
                        fallbackData={item.user}
                    />
                    <NotificationLink item={item} />
                </Box>
                {
                    item.token && item.token &&
                    <Link href={`/nft/${item.token.id}`} passHref>
                        <a>
                            <AssetThumbnail token={item.token} />
                        </a>
                    </Link>
                }
                {
                    followed(item) &&
                    <FollowButton profileAddress={item.subject} variant="text" />
                }
            </Box>
        </Box>
    )
}
