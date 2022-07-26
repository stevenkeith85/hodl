import { Box, Typography } from "@mui/material";
import useSWR from "swr";
import { fetchWithId } from "../../lib/swrFetchers";
import Link from "next/link";
import { ProfileAvatar } from "../avatar/ProfileAvatar";
import { FC, useContext } from "react";
import axios from 'axios';
import { WalletContext } from "../../contexts/WalletContext";
import { HodlAction, ActionTypes } from "../../models/HodlAction";
import { HodlImage } from "../HodlImage";
import { assetType, truncateText } from "../../lib/utils";
import { ProfileNameOrAddress } from '../avatar/ProfileNameOrAddress';
import { formatDistanceStrict } from "date-fns";
import { AssetTypes } from "../../models/AssetType";
import { HodlVideo } from "../HodlVideo";

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
        <Box 
            sx={{ 
                // opacity: lastRead > (item?.timestamp || 0) ? 0.8 : 1 
            }} 
            >
            <Box display="flex" alignItems="center" gap={1} >
                <Box display="flex" alignItems="center" onClick={() => setShowNotifications(false)} gap={1.5} flexGrow={1}>
                    <ProfileAvatar profileAddress={item.subject} size="small" showNickname={false} />
                    <Box component="span" sx={{ cursor: 'pointer', textDecoration: 'none' }}>
                        {item?.subject && item?.subject !== address &&
                            <ProfileNameOrAddress
                                color={"primary"}
                                profileAddress={item.subject}
                                size={"small"}
                                sx={{ fontWeight: 600 }}
                            />}
                        {item?.subject && item?.subject === address &&
                            <Typography component="span" sx={{ fontWeight: 600 }}>You</Typography>
                        }
                        {' '}

                        {/* Liked */}
                        {item.action === ActionTypes.Liked && item.object === "token" && token && <>
                            <Link href={`/nft/${item.objectId}`} passHref>
                                <Typography component="a" sx={{ textDecoration: 'none', color: '#333' }}>
                                    liked a token.
                                </Typography>
                            </Link>
                        </>

                        }
                        {item.action === ActionTypes.Liked && item.object === "comment" && comment && <>
                            <Link href={`/nft/${comment.tokenId}?comment=${comment.id}`}>
                                <Typography component="a" sx={{ textDecoration: 'none', color: '#333' }}>
                                    liked a comment: {truncateText(comment.comment, 80)}.
                                </Typography>
                            </Link>
                        </>
                        }

                        {/* Commented / Replied */}
                        {item.action === ActionTypes.CommentedOn && item.object === "comment" && comment && <>
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
                    token && token?.image &&
                    <Link href={comment ? `/nft/${comment.tokenId}` : `/nft/${item.objectId}`}>
                        <Box sx={{ cursor: 'pointer' }}>
                            {assetType(token) === AssetTypes.Image &&
                                <a>
                                    <HodlImage
                                        cid={token.image.split('//')[1]}
                                        effect={token.filter}
                                        height={'44px'}
                                        width={'44px'}
                                        sx={{ img: { borderRadius: 0 } }}
                                    />
                                </a>
                            }
                            {assetType(token) === AssetTypes.Video &&
                                <a>
                                    <HodlVideo
                                        cid={token.image.split('//')[1]}
                                        controls={false}
                                        onlyPoster={true}
                                        preload="none"
                                        audio={false}
                                        height='44px'
                                        width='44px'
                                        sx={{
                                            video: {
                                                objectFit: 'cover',
                                                objectPosition: 'center',
                                                borderRadius: 0,
                                                background: '#fafafa',
                                            }
                                        }}
                                    />
                                </a>
                            }
                            {assetType(token) === AssetTypes.Gif &&
                                <a>
                                    <HodlVideo
                                        cid={token.image.split('//')[1]}
                                        gif={true}
                                        height='44px'
                                        width='44px'
                                        sx={{
                                            video: {
                                                objectFit: 'cover',
                                                objectPosition: 'center',
                                                borderRadius: 0,
                                                background: '#fafafa',
                                            }
                                        }}
                                    />
                                </a>
                            }
                            {assetType(token) === AssetTypes.Audio &&
                                <a>
                                    <HodlVideo
                                        cid={token.image.split('//')[1]}
                                        controls={false}
                                        onlyPoster={true}
                                        preload="none"
                                        audio={true}
                                        height='44px'
                                        width='44px'
                                        sx={{
                                            video: {
                                                objectFit: 'contain',
                                                objectPosition: 'center',
                                                borderRadius: 0,
                                                background: '#fafafa',
                                            }
                                        }}
                                    />
                                </a>
                            }
                        </Box>
                    </Link>
                }
            </Box>
        </Box>
    )
}
