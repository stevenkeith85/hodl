import { Box, Typography } from "@mui/material";
import useSWR from "swr";
import { fetchWithId } from "../lib/swrFetchers";
import Link from "next/link";
import { ProfileAvatar } from "./ProfileAvatar";
import { FC, useContext } from "react";
import axios from 'axios';
import { WalletContext } from "../contexts/WalletContext";
import { HodlNotification, NotificationTypes } from "../models/HodlNotifications";
import { HodlImage } from "./HodlImage";
import { truncateText } from "../lib/utils";
import { ProfileNameOrAddress } from './ProfileNameOrAddress';
import { formatDistanceStrict } from "date-fns";

interface HodlNotificationBoxProps {
    item: HodlNotification;
    setShowNotifications: Function;
}

export const HodlNotificationBox: FC<HodlNotificationBoxProps> = ({ item, setShowNotifications }) => {
    const { address } = useContext(WalletContext);


    const { data: comment } = useSWR(item.object === "comment" ? [`/api/comment`, item.id] : null,
        fetchWithId,
        {
            revalidateOnMount: true
        });

    const { data: token } = useSWR(item.object === "token" ? [`/api/token`, item.id] : comment ? [`/api/token`, comment.tokenId] : null,
        (url, query) => axios.get(`${url}/${query}`).then(r => r.data.token),
        {
            revalidateOnMount: true
        });



    const lastRead = (localStorage.getItem(`notifications-${address}-last-read`) || 0);

    return (
        <Box sx={{ opacity: lastRead > (item?.timestamp || 0) ? 0.8 : 1 }} >
            <Box display="flex" alignItems="center" gap={1} >
                <Box display="flex" alignItems="center" onClick={() => setShowNotifications(false)} gap={1.5} flexGrow={1}>
                    <ProfileAvatar profileAddress={item.subject} size="small" showNickname={false} />
                    <Box component="span" sx={{ cursor: 'pointer', textDecoration: 'none' }}>
                        {/* {JSON.stringify(item, null, 2)} */}

                        {item?.subject &&
                            <ProfileNameOrAddress
                                color={"primary"}
                                profileAddress={item.subject}
                                size={"small"}
                                sx={{ fontWeight: 600 }}
                            />}
                        {' '}

                        {/* Liked */}
                        {item.action === NotificationTypes.Liked && item.object === "token" && token && <>
                            <Link href={`/nft/${item.id}`} passHref>
                                <Typography component="a" sx={{ textDecoration: 'none', color: '#333' }}>
                                    liked your token.
                                </Typography>
                            </Link>
                        </>

                        }
                        {item.action === NotificationTypes.Liked && item.object === "comment" && comment && <>

                            <Link href={`/nft/${comment.tokenId}?comment=${comment.id}`}>
                                <Typography component="a" sx={{ textDecoration: 'none', color: '#333' }}>
                                    liked your comment: {truncateText(comment.comment, 80)}.
                                </Typography>
                            </Link>
                        </>
                        }

                        {/* Commented / Replied */}
                        {item.action === NotificationTypes.CommentedOn && item.object === "comment" && comment && <>
                            {comment.object === "token" && <>
                                <Link href={`/nft/${comment.tokenId}?comment=${comment.id}`}>
                                    <Typography component="a" sx={{ textDecoration: 'none', color: '#333' }}>
                                        commented: {truncateText(comment.comment, 80)}.
                                    </Typography>
                                </Link>
                            </>}
                            {comment.object === "comment" && <>
                                <Link href={`/nft/${comment.tokenId}?comment=${comment.objectId}`}>
                                    <Typography component="a" sx={{ textDecoration: 'none', color: '#333' }}>
                                        replied: {truncateText(comment.comment, 80)}.
                                    </Typography>
                                </Link>
                            </>}
                        </>
                        }

                        {/* Listed */}
                        {
                            item.action === NotificationTypes.Listed &&
                            <Link href={`/nft/${item.id}`}>
                                <Typography component="a" sx={{ textDecoration: 'none', color: '#333' }}>
                                    listed a token
                                </Typography>
                            </Link>
                        }

                        {/* Bought */}
                        {
                            item.action === NotificationTypes.Bought &&
                            <Link href={`/nft/${item.id}`}>
                                <Typography component="a" sx={{ cursor: "pointer" }}>
                                    bought a token
                                </Typography>
                            </Link>
                        }

                        {/* Followed */}
                        {
                            item.action === NotificationTypes.Followed &&
                            <Typography component="span">followed you.</Typography>
                        }
                        {' '}
                        <Typography component="span" sx={{ fontSize: 10, color: "#999" }}>
                            {item.timestamp && formatDistanceStrict(new Date(item.timestamp), new Date(), { addSuffix: false })}
                        </Typography>
                    </Box>
                </Box>
                {
                    token && token?.image &&
                    <Link href={comment ? `/nft/${comment.tokenId}` : `/nft/${item.id}`}>
                        <a><HodlImage cid={token.image.split('//')[1]} effect={token.filter} height={'44px'} width={'44px'} sx={{ img: { borderRadius: 0 } }} /></a>
                    </Link>
                }
            </Box>
        </Box>
    )
}
