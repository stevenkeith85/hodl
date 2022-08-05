import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { FC, useContext } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { ActionTypes, HodlActionViewModal } from "../../models/HodlAction";
import { truncateText } from "../../lib/utils";
import { ProfileNameOrAddress } from '../avatar/ProfileNameOrAddress';
import { formatDistanceStrict } from "date-fns";
import { UserAvatarAndHandle } from "../avatar/UserAvatarAndHandle";
import { AssetThumbnail } from "../AssetThumbnail";
import { FollowButton } from "../profile/FollowButton";

interface HodlNotificationBoxProps {
    item: HodlActionViewModal;
    setShowNotifications: Function;
}

export const HodlNotificationBox: FC<HodlNotificationBoxProps> = ({ item, setShowNotifications }) => {
    const { address } = useContext(WalletContext);

    return (
        <Box key={item?.id}>
            <Box display="flex" alignItems="center" gap={2} >
                <Box display="flex" alignItems="center" onClick={() => setShowNotifications(false)} gap={1.5} flexGrow={1}>
                    <UserAvatarAndHandle
                        address={item.subject}
                        size="44px"
                        handle={false}
                    />
                    <Box component="span" sx={{ cursor: 'pointer', textDecoration: 'none' }}>
                        {
                            item?.subject && item?.subject !== address &&
                            <ProfileNameOrAddress
                                color={"primary"}
                                profileAddress={item.subject}
                                sx={{ fontWeight: 600 }}
                            />}

                        {/* TODO: This is just a temp thing as we are notifying the user of extra stuff at the moment */}
                        {
                            item?.subject && item?.subject === address &&
                            <Typography component="span" sx={{ fontWeight: 600 }}>You</Typography>
                        }
                        {' '}

                        {/* Liked Token */}
                        {
                            item.action === ActionTypes.Liked && item.object === "token" && <>
                                <Link href={`/nft/${item.token.id}`} passHref>
                                    <Typography component="a" sx={{ textDecoration: 'none', color: '#333' }}>
                                        liked a token.
                                    </Typography>
                                </Link>
                            </>
                        }
                        {/* Liked Comment */}
                        {
                            item.action === ActionTypes.Liked && item.object === "comment" && <>
                                <Link href={`/nft/${item.token.id}?comment=${item.comment.id}`} passHref>
                                    <Typography component="a" sx={{ textDecoration: 'none', color: '#333' }}>
                                        liked a comment: {truncateText(item.comment.comment, 80)}
                                    </Typography>
                                </Link>
                            </>
                        }
                        {/* Commented / Replied */}
                        {
                            item.action === ActionTypes.CommentedOn && item.object === "comment" && <>
                                {
                                    item.comment === null && <>made a comment, that has now been [ deleted ].</>
                                }
                                {
                                    item.comment && item.comment.object === "token" && <>
                                        <Link href={`/nft/${item.token.id}?comment=${item.comment.id}`} passHref>
                                            <Typography component="a" sx={{ textDecoration: 'none', color: '#333' }}>
                                                commented: {truncateText(item.comment.comment, 80)}
                                            </Typography>
                                        </Link>
                                    </>
                                }
                                {
                                    item.comment && item.comment.object === "comment" && <>
                                        <Link href={`/nft/${item.token.id}?comment=${item.comment.id}`} passHref>
                                            <Typography component="a" sx={{ textDecoration: 'none', color: '#333' }}>
                                                replied: {truncateText(item.comment.comment, 80)}
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
                                <Typography component="a" sx={{ cursor: "pointer" }}>
                                    bought a token.
                                </Typography>
                            </Link>
                        }

                        {/* Followed */}
                        {
                            item.action === ActionTypes.Followed &&
                            <Typography component="span">followed you.</Typography>
                        }
                        {' '}
                        <Typography component="span" sx={{ fontSize: 10, color: "#999" }}>
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
