import { Badge, Box, Chip, Skeleton, Typography } from "@mui/material";
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
import { Likes } from "../Likes";
import { Comments } from "../comments/Comments";


interface HodlFeedItemProps {
    item: HodlAction;
}

export const HodlFeedItem: FC<HodlFeedItemProps> = ({ item }) => {
    const { address } = useContext(WalletContext);


    const { data: comment } = useSWR(item.object === "comment" ? [`/api/comment`, item.objectId] : null,
        fetchWithId,
        {
            revalidateOnMount: true
        });

    const { data: token } = useSWR(item.object === "token" ?
        [`/api/token`, item.objectId] :
        comment ?
            [`/api/token`, comment.tokenId] :
            null,
        (url, query) => axios.get(`${url}/${query}`).then(r => r.data.token),
        {
            revalidateOnMount: true
        });

    return (
        <>{
            !token && <Box
                display="flex"
                flexDirection="column"
                gap={2}
                sx={{
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    padding: 2,
                    boxShadow: '0 0 2px 1px #eee',
                    width: `100%`,
                    overflow: 'hidden'
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
                        gap={2}
                    >
                        <Skeleton variant="circular" width={44} height={44} />
                        <Skeleton variant="text" width={100} />
                    </Box>
                    <Box marginX={-2}>
                        <Skeleton variant="rectangular" height={300} />
                    </Box>
                </Box>
                <Box display="flex" flexDirection="column" gap={1}>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                </Box>
            </Box>
        }
            {token && <Box
                display="flex"
                flexDirection="column"
                gap={2}
                sx={{
                    borderRadius: 1,
                    padding: 2,
                    boxShadow: '0 0 2px 1px #eee',
                    width: `100%`,
                    overflow: 'hidden'
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
                        gap={2}
                    >
                        <ProfileAvatar
                            profileAddress={item.subject}
                            size="small"
                            showNickname={false}
                        />
                        <Box
                            flexGrow={1}
                            sx={{
                                cursor: 'pointer',
                                textDecoration: 'none'
                            }}>
                            <Box display="flex" justifyContent="space-between" width="100%">
                                <Box display="flex" flexDirection="column" component="span">
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
                                    <Typography component="span" sx={{ fontSize: 10, color: "#999" }}>
                                        {item.timestamp && formatDistanceStrict(new Date(item.timestamp), new Date(), { addSuffix: true })}
                                    </Typography>
                                </Box>
                                {item.action === ActionTypes.Added && <Box component="span"><Chip label="New" variant="outlined" color="success" /></Box>}
                                {item.action === ActionTypes.Listed && <Box component="span"><Chip label="Listed" variant="outlined" color="secondary" /></Box>}
                            </Box>
                        </Box>
                    </Box>
                    {
                        token && token?.image &&
                        <Link href={comment ? `/nft/${comment.tokenId}` : `/nft/${item.objectId}`}>
                            <Box sx={{ cursor: 'pointer', marginX: -2 }}>
                                {assetType(token) === AssetTypes.Image &&
                                    <a>
                                        <HodlImage
                                            cid={token.image.split('//')[1]}
                                            effect={token.filter}
                                            sx={{ img: { borderRadius: 0 } }}
                                            loading="eager"
                                            sizes="(max-width:599px) 600px, (max-width:899px) 900px, 700px"
                                        />
                                    </a>
                                }
                                {assetType(token) === AssetTypes.Video &&
                                    <a>
                                        <HodlVideo
                                            cid={token.image.split('//')[1]}
                                            controls={true}
                                            onlyPoster={false}
                                            preload="none"
                                            audio={false}
                                            autoPlay={true}
                                            sx={{ video: { borderRadius: 0, maxHeight: '50vh' } }}
                                        />
                                    </a>
                                }
                                {assetType(token) === AssetTypes.Gif &&
                                    <a>
                                        <HodlVideo
                                            cid={token.image.split('//')[1]}
                                            gif={true}
                                            sx={{ video: { borderRadius: 0, maxHeight: '50vh' } }}
                                        />
                                    </a>
                                }
                                {assetType(token) === AssetTypes.Audio &&
                                    <a>
                                        <HodlVideo
                                            cid={token.image.split('//')[1]}
                                            controls={true}
                                            onlyPoster={false}
                                            height="280px"
                                            preload="true"
                                            audio={true}
                                            sx={{
                                                video: {
                                                    objectPosition: 'top',
                                                    borderRadius: 0
                                                }
                                            }}
                                        />
                                    </a>
                                }
                            </Box>

                        </Link>
                    }
                </Box>


                <Box
                    display="flex"
                    gap={1}
                    flexDirection="column"
                >
                    {token && <Box display="flex" gap={1}>
                        <Likes
                            id={token?.tokenId}
                            token={true}
                        />
                        <Comments
                            nft={token}
                        />
                    </Box>}
                </Box>
                <Box>
                    <Typography mb={1} component="h2" sx={{ fontWeight: 600 }}>{token?.name}</Typography>
                    <Typography>{token?.description}</Typography>
                </Box>
            </Box>}
        </>
    )
}
