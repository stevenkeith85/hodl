import { Badge, Box, Chip, Typography } from "@mui/material";
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


    const { data: comment } = useSWR(item.object === "comment" ? [`/api/comment`, item.id] : null,
        fetchWithId,
        {
            revalidateOnMount: true
        });

    const { data: token } = useSWR(item.object === "token" ?
        [`/api/token`, item.id] :
        comment ?
            [`/api/token`, comment.tokenId] :
            null,
        (url, query) => axios.get(`${url}/${query}`).then(r => r.data.token),
        {
            revalidateOnMount: true
        });

    return (
        <Box
            display="flex"
            flexDirection="column"
            gap={2}
            sx={{
                border: '1px solid #ddd',
                borderRadius: 1,
                padding: 2,
                boxShadow: '0 0 2px 1px #eee',
                // width: {xs: '100%', sm:'80%', md: '70%' }
                // maxWidth: '600px'
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
                        {/* {JSON.stringify(item, null, 2)} */}

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
                            {item.action === ActionTypes.Added && <Box component="span"><Chip label="New" color="success" /></Box>}
                            {item.action === ActionTypes.Listed && <Box component="span"><Chip label="Listed" color="secondary" /></Box>}
                        </Box>
                    </Box>
                </Box>
                {
                    token && token?.image &&
                    <Link href={comment ? `/nft/${comment.tokenId}` : `/nft/${item.id}`}>
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
                                        sx={{ video: { borderRadius: 0 } }}
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
            <Box>
                <Typography component="h2" sx={{ fontWeight: 600 }}>{token?.name}</Typography>
            </Box>
            <Box>
                {token?.description}
            </Box>
            <Box
                display="flex"
                gap={2}
                paddingY={1}
                flexDirection="column"
            >
                {token && <Box display="flex" gap={1} justifyContent="right">
                    <Likes
                        id={token?.tokenId}
                        token={true}
                    />
                    <Comments
                        nft={token}
                    />
                </Box>}
            </Box>
        </Box>
    )
}
