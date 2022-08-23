import { Box, Chip, NoSsr, Typography } from "@mui/material";
import Link from "next/link";
import { FC, useContext } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { ActionTypes, HodlActionViewModel } from "../../models/HodlAction";
import { ProfileNameOrAddress } from '../avatar/ProfileNameOrAddress';
import { formatDistanceStrict } from "date-fns";
import { Likes } from "../Likes";
import { Comments } from "../comments/Comments";
import { insertTagLinks } from "../../lib/templateUtils";
import { UserAvatarAndHandle } from "../avatar/UserAvatarAndHandle";
import { FeedAsset } from "./FeedAsset";
import { MaticPrice } from "../MaticPrice";


interface HodlFeedItemProps {
    item: HodlActionViewModel;
}

export const HodlFeedItem: FC<HodlFeedItemProps> = ({ item }) => {
    const { address } = useContext(WalletContext);

    return (
        <>
            {<Box
                display="flex"
                flexDirection="column"
                gap={2}
                sx={{
                    borderRadius: 1,
                    padding: 2,
                    border: `1px solid #ddd`,
                    width: "min(575px, 90vw)",
                    maxWidth: "90%",
                    overflow: 'hidden',
                    background: 'white'
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
                        <UserAvatarAndHandle
                            address={item.subject}
                            handle={false}
                            fallbackData={item.user}
                        />
                        <Box
                            flexGrow={1}
                            sx={{
                                cursor: 'pointer',
                                textDecoration: 'none'
                            }}>
                            <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                                <Box display="flex" flexDirection="column" component="span">
                                    {item?.subject && item?.subject !== address &&
                                        <ProfileNameOrAddress
                                            color={"primary"}
                                            profileAddress={item.subject}
                                            fallbackData={item.user}
                                            sx={{ fontWeight: 600 }}
                                        />}
                                    {item?.subject && item?.subject === address &&
                                        <Typography component="span" sx={{ fontWeight: 600 }}>You</Typography>
                                    }
                                    <NoSsr>
                                        <Typography component="span" sx={{ fontSize: 10, color: "#999" }}>
                                            {item.timestamp && formatDistanceStrict(new Date(item.timestamp), new Date(), { addSuffix: true })}
                                        </Typography>
                                    </NoSsr>
                                </Box>
                                {item.action === ActionTypes.Listed &&
                                    <Box
                                        sx={{
                                            textAlign: 'right',
                                            fontFamily: theme => theme.logo.fontFamily,
                                            color: theme => theme.palette.text.secondary
                                        }}>
                                        {
                                            item?.metadata?.price && <MaticPrice price={item?.metadata?.price} color="black" size={14} fontSize={14} />
                                        }
                                    </Box>
                                }
                                {item.action === ActionTypes.Bought &&
                                    <Box
                                        sx={{
                                            textAlign: 'right',
                                            fontFamily: theme => theme.logo.fontFamily,
                                            color: theme => theme.palette.text.secondary
                                        }}>
                                        sold
                                        {
                                            item?.metadata?.price && <MaticPrice price={item?.metadata?.price} color="black" />
                                        }
                                    </Box>
                                }
                                {item.action === ActionTypes.Delisted &&
                                    <Box
                                        sx={{
                                            textAlign: 'right',
                                            fontFamily: theme => theme.logo.fontFamily,
                                            color: theme => theme.palette.text.secondary
                                        }}>
                                        delisted
                                    </Box>
                                }
                                {item.action === ActionTypes.Added &&
                                    <Box
                                        sx={{
                                            textAlign: 'right',
                                            fontFamily: theme => theme.logo.fontFamily,
                                            color: theme => theme.palette.text.secondary
                                        }}>
                                        new
                                    </Box>
                                }
                            </Box>
                        </Box>
                    </Box>
                    {
                        item.token?.image &&
                        <Link href={`/nft/${item.token.id}`} passHref>
                            <Box
                                sx={{
                                    cursor: 'pointer',
                                    marginX: -2,
                                }}>
                                <FeedAsset item={item} />
                            </Box>
                        </Link>
                    }
                </Box>
                <Box
                    display="flex"
                >
                    {item.token && <Box display="flex" gap={1.5}>
                        <Likes
                            id={item.token?.id}
                            object="token"
                            fontSize='22px'
                        />
                        <Comments
                            nft={item.token}
                            fontSize='22px'
                        />
                    </Box>}
                </Box>
                <Box>
                    <Typography marginY={1} component="h2" sx={{ fontWeight: 600 }}>{item.token?.name}</Typography>
                    <Box sx={{ whiteSpace: 'pre-line' }}>{insertTagLinks(item.token?.description)}</Box>
                </Box>
            </Box>}
        </>
    )
}
