import { FC, useContext } from "react";

import Link from "next/link";

import { ActionTypes, HodlActionViewModel } from "../../models/HodlAction";
import { ProfileNameOrAddress } from '../avatar/ProfileNameOrAddress';
import { formatDistanceStrict } from "date-fns";
import { UserAvatarAndHandle } from "../avatar/UserAvatarAndHandle";
import { AssetThumbnail } from "../AssetThumbnail";
import { FollowButton } from "../profile/FollowButton";
import { WalletContext } from "../../contexts/WalletContext";
import { MaticPrice } from "../MaticPrice";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { truncateText } from "../../lib/truncateText";

// Boolean guards

const likedToken = item => item.action === ActionTypes.Liked && item.object === "token";
const likedDeletedComment = item => item.action === ActionTypes.Liked && item.object === "comment" && item.comment === null;
const likedComment = item => item.action === ActionTypes.Liked && item.object === "comment" && item.comment !== null;
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
const LikedComment = ({ item }) => <>{`liked your comment: ${truncateText(item?.comment?.comment, 70)}.`}</>
const MadeDeletedComment = () => <>commented on your token: [deleted]</>
const CommentedOnToken = ({ item }) => <>{`commented on your token: ${truncateText(item?.comment?.comment, 70)}.`}</>
const RepliedToComment = ({ item }) => <>{`replied: ${truncateText(item?.comment?.comment, 70)}.`}</>

const MintedToken = () => <>minted a token on the blockchain</>
const ListedToken = ({ item }) => <>listed a token on the market for <MaticPrice price={item?.metadata?.price} color="black" fontSize={14} size={14} sx={{ marginLeft: 0.5 }} /></>
const DelistedToken = ({ item }) => <>delisted a token from the market</>
const BoughtToken = ({ item }) => {
    const { address } = useContext(WalletContext);

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
    const { address } = useContext(WalletContext);

    return (<Box
        sx={{
            width: `100%`,
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
                    sx={{ fontWeight: 600 }}
                    you={item?.subject === address}
                />}

        </Box>
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
            <Typography component="a">
                <MessageWithAvatarAndTime item={item}>
                    <LikedDeletedComment />
                </MessageWithAvatarAndTime>
            </Typography>
        }
        {
            likedComment(item) &&
            <Link href={`/nft/${item?.comment.tokenId}?comment=${item?.comment?.id}`} passHref>
                <Typography component="a">
                    <MessageWithAvatarAndTime item={item}>
                        <LikedComment item={item} />
                    </MessageWithAvatarAndTime>
                </Typography>
            </Link>
        }
        {
            madeDeletedComment(item) &&
            <Typography component="a">
                <MessageWithAvatarAndTime item={item}>
                    <MadeDeletedComment />
                </MessageWithAvatarAndTime>
            </Typography>
        }
        {
            commentedOnToken(item) &&
            <Link href={`/nft/${item.comment.tokenId}?comment=${item.comment.id}`} passHref>
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
                        <BoughtToken item={item} />
                    </MessageWithAvatarAndTime>
                </Typography>
            </Link>
        }
        {
            mintedToken(item) &&
            <Link href={`/nft/${item?.token?.id}`} passHref>
                <Typography component="a">
                    <MessageWithAvatarAndTime item={item}>
                        <MintedToken />
                    </MessageWithAvatarAndTime>
                </Typography>
            </Link>
        }
        {
            listedToken(item) &&
            <Link href={`/nft/${item?.token?.id}`} passHref>
                <Typography component="a">
                    <MessageWithAvatarAndTime item={item}>
                        <ListedToken item={item} />
                    </MessageWithAvatarAndTime>
                </Typography>
            </Link>
        }
        {
            delistedToken(item) &&
            <Link href={`/nft/${item?.token?.id}`} passHref>
                <Typography component="a">
                    <MessageWithAvatarAndTime item={item}>
                        <DelistedToken item={item} />
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
    sx?: object;
}
export const HodlNotificationBox: FC<HodlNotificationBoxProps> = ({
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
                        // background: 'blue',
                        width: '80px',
                        display: 'flex',
                        alignItems: 'start',
                        justifyContent: 'end'
                    }}
                >
                    {
                        item.token && item.token &&
                        <Link href={`/nft/${item.token.id}`} passHref>
                            <Typography
                                component="a"
                                sx={{
                                    display: 'block',
                                    width: 44,
                                    height: 44,
                                    // background: 'yellow'
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
