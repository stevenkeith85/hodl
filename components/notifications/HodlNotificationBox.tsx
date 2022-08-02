import { Box, Typography } from "@mui/material";
import useSWR from "swr";
import { fetchWithId } from "../../lib/swrFetchers";
import Link from "next/link";
import { FC, useContext } from "react";
import axios from 'axios';
import { WalletContext } from "../../contexts/WalletContext";
import { HodlAction, ActionTypes } from "../../models/HodlAction";
import { truncateText } from "../../lib/utils";
import { ProfileNameOrAddress } from '../avatar/ProfileNameOrAddress';
import { formatDistanceStrict } from "date-fns";
import { UserAvatarAndHandle } from "../avatar/UserAvatarAndHandle";
import { AssetThumbnail } from "../AssetThumbnail";
import { FollowButton } from "../profile/FollowButton";

interface HodlNotificationBoxProps {
    item: HodlAction;
    setShowNotifications: Function;
}

export const HodlNotificationBox: FC<HodlNotificationBoxProps> = ({ item, setShowNotifications }) => {
    const { address } = useContext(WalletContext);

    const { data: comment } = useSWR(item.object === "comment" ? [`/api/comment`, item.objectId] : null,
        fetchWithId);

    const { data: token } = useSWR(item.object === "token" ?
        [`/api/token`, item.objectId] :
        comment ?
            [`/api/token`, comment.tokenId] :
            null,
        (url, query) => axios.get(`${url}/${query}`).then(r => r.data.token));

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
                            item.action === ActionTypes.Liked && item.object === "token" && token && <>
                                <Link href={`/nft/${item.objectId}`} passHref>
                                    <Typography component="a" sx={{ textDecoration: 'none', color: '#333' }}>
                                        liked a token.
                                    </Typography>
                                </Link>
                            </>
                        }
                        {/* Liked Comment */}
                        {
                            item.action === ActionTypes.Liked && item.object === "comment" && comment && <>
                                <Link href={`/nft/${comment.tokenId}?comment=${comment.id}`}>
                                    <Typography component="a" sx={{ textDecoration: 'none', color: '#333' }}>
                                        liked a comment: {truncateText(comment.comment, 80)}.
                                    </Typography>
                                </Link>
                            </>
                        }

                        {/* Commented / Replied */}
                        {
                            item.action === ActionTypes.CommentedOn && item.object === "comment" && comment && <>
                                {
                                    comment.object === "token" && <>
                                        <Link href={`/nft/${comment.tokenId}?comment=${comment.id}`}>
                                            <Typography component="a" sx={{ textDecoration: 'none', color: '#333' }}>
                                                commented: {truncateText(comment.comment, 80)}.
                                            </Typography>
                                        </Link>
                                    </>
                                }
                                {
                                    comment.object === "comment" && <>
                                        <Link href={`/nft/${comment.tokenId}?comment=${comment.objectId}`}>
                                            <Typography component="a" sx={{ textDecoration: 'none', color: '#333' }}>
                                                replied: {truncateText(comment.comment, 80)}.
                                            </Typography>
                                        </Link>
                                    </>
                                }
                            </>
                        }

                        {/* Added */}
                        {
                            item.action === ActionTypes.Added &&
                            <Link href={`/nft/${item.objectId}`}>
                                <Typography component="a" sx={{ textDecoration: 'none', color: '#333' }}>
                                    added a new token.
                                </Typography>
                            </Link>
                        }

                        {/* Listed */}
                        {
                            item.action === ActionTypes.Listed &&
                            <Link href={`/nft/${item.objectId}`}>
                                <Typography component="a" sx={{ textDecoration: 'none', color: '#333' }}>
                                    listed a token.
                                </Typography>
                            </Link>
                        }

                        {/* Bought */}
                        {
                            item.action === ActionTypes.Bought &&
                            <Link href={`/nft/${item.objectId}`}>
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
                    token && token.image &&
                    <Link href={comment ? `/nft/${comment.tokenId}` : `/nft/${item.objectId}`}>
                        <AssetThumbnail token={token} />
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
