import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { FC, useContext } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { ActionTypes, HodlActionViewModel } from "../../models/HodlAction";
import { truncateText } from "../../lib/utils";
import { ProfileNameOrAddress } from '../avatar/ProfileNameOrAddress';
import { formatDistanceStrict } from "date-fns";
import { UserAvatarAndHandle } from "../avatar/UserAvatarAndHandle";
import { AssetThumbnail } from "../AssetThumbnail";
import { FollowButton } from "../profile/FollowButton";
import { blue, indigo, lightBlue } from "@mui/material/colors";

interface HodlNotificationBoxProps {
    item: HodlActionViewModel;
    setShowNotifications: Function;
    lastRead: number;
}

export const HodlNotificationBox: FC<HodlNotificationBoxProps> = ({ item, setShowNotifications, lastRead }) => {

    return (
        <Box key={item?.id} sx={{
            background: lastRead < item.timestamp ? "#ECF3FF": "none",
            padding: 1
        }}>
            <Box display="flex" alignItems="center" gap={2} >
                <Box display="flex" alignItems="center" onClick={() => setShowNotifications(false)} gap={1.5} flexGrow={1}>
                {/* <div><pre style={{ width:`400px`}}>{ JSON.stringify(item, null, 2)}</pre></div> */}
                    <UserAvatarAndHandle
                        address={item.subject}
                        size="44px"
                        handle={false}
                        fallbackData={item.user}
                    />
                    
                    <Box component="span" sx={{ cursor: 'pointer', textDecoration: 'none' }}>
                        {
                            item?.subject &&
                            <ProfileNameOrAddress
                                color={"primary"}
                                profileAddress={item.subject}
                                fallbackData={item.user}
                                sx={{ fontWeight: 600 }}
                            />}
                        {' '}

                        {/* Liked Token */}
                        {
                            item.action === ActionTypes.Liked && item.object === "token" && <>
                                <Link href={`/nft/${item.token.id}`} passHref>
                                    <Typography
                                        component="a"
                                        sx={{
                                            textDecoration: 'none',
                                            color: theme => theme.palette.text.primary
                                        }}>
                                        liked a token.
                                    </Typography>
                                </Link>
                            </>
                        }
                        {/* Liked Comment */}
                        {
                            item.action === ActionTypes.Liked && item.object === "comment" && <>
                                {
                                    item.comment === null && <>liked a comment, that has now been [deleted].</>
                                }
                                {item.comment && <Link href={`/nft/${item?.token?.id}?comment=${item?.comment?.id}`} passHref>
                                    <Typography
                                        component="a"
                                        sx={{
                                            textDecoration: 'none',
                                            color: theme => theme.palette.text.primary
                                        }}>
                                        liked a comment: {truncateText(item?.comment?.comment, 70)}
                                    </Typography>
                                </Link>}
                            </>
                        }
                        {/* Commented / Replied */}
                        {
                            item.action === ActionTypes.Commented && item.object === "comment" && <>
                                {
                                    item.comment === null && <>made a comment, that has now been [deleted].</>
                                }
                                {
                                    item.comment && item.comment.object === "token" && <>
                                        <Link href={`/nft/${item.token.id}?comment=${item.comment.id}`} passHref>
                                            <Typography
                                                component="a"
                                                sx={{
                                                    textDecoration: 'none',
                                                    color: theme => theme.palette.text.primary
                                                }}>
                                                commented: {truncateText(item.comment.comment, 70)}
                                            </Typography>
                                        </Link>
                                    </>
                                }
                                {
                                    item.comment && item.comment.object === "comment" && <>
                                        <Link href={`/nft/${item?.token?.id}?comment=${item?.comment?.id}`} passHref>
                                            <Typography
                                                component="a"
                                                sx={{
                                                    textDecoration: 'none',
                                                    color: theme => theme.palette.text.primary
                                                }}>
                                                replied: {truncateText(item.comment.comment, 70)}
                                            </Typography>
                                        </Link>
                                    </>
                                }
                            </>
                        }

                        {/* Bought */}
                        {
                            item.action === ActionTypes.Bought &&
                            <Link href={`/nft/${item.token.id}`} passHref>
                                <Typography component="a"
                                    sx={{
                                        cursor: "pointer",
                                        textDecoration: 'none',
                                        color: theme => theme.palette.text.primary
                                    }}>
                                    bought a token.
                                </Typography>
                            </Link>
                        }

                        {/* Followed */}
                        {
                            item.action === ActionTypes.Followed &&
                            <Typography 
                                component="span"
                            >
                                followed you.
                            </Typography>
                        }
                        {' '}
                        <Typography 
                            component="span" 
                            sx={{ 
                                fontSize: 10, 
                                color: theme => theme.palette.text.secondary 
                            }}>
                            {item.timestamp && formatDistanceStrict(new Date(item.timestamp), new Date(), { addSuffix: false })}
                        </Typography>
                    </Box>
                </Box>
                {
                    item.token && item.token &&
                    <Link href={`/nft/${item.token.id}`} passHref>
                        <a>
                            <AssetThumbnail token={item.token} />
                        </a>
                    </Link>
                }
                {/* Followed */}
                {
                    item.action === ActionTypes.Followed &&
                    <FollowButton profileAddress={item.subject} variant="text" />
                }
            </Box>
        </Box>
    )
}
