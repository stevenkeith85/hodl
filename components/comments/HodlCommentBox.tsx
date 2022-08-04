import { Typography, Box, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import axios from 'axios'
import useSWR from "swr";
import { Likes } from "../Likes";
import { HighlightOffOutlined, Message, Reply } from "@mui/icons-material";
import { useLike } from "../../hooks/useLike";
import { useComments, useCommentCount, useDeleteComment } from "../../hooks/useComments";
import { FC, useContext, useState } from "react";
import { HodlComment, HodlCommentViewModel } from "../../models/HodlComment";
import { WalletContext } from "../../contexts/WalletContext";
import { formatDistanceStrict } from "date-fns";
import { ProfileNameOrAddress } from "../avatar/ProfileNameOrAddress";
import { UserAvatarAndHandle } from "../avatar/UserAvatarAndHandle";
import { NftContext } from "../../contexts/NftContext";
import { useLikeCount } from "../../hooks/useLikeCount";

interface HodlCommentBoxProps {
    comment: HodlCommentViewModel;
    color?: "primary" | "secondary";
    setCommentingOn: Function;

    parentMutateList: Function;
    parentMutateCount: Function;

    addCommentInput: any;

    // we need to pass in the swr's for a single comment thread
    replyCountSWR?: any;
    replySWR?: any;

    shouldShowThread?: boolean;
    setTopLevel?: any | null;
    mutateCount?: any | null;
}

export const HodlCommentBox: FC<HodlCommentBoxProps> = ({
    comment,
    color = "secondary",
    setCommentingOn,
    parentMutateList,
    parentMutateCount,
    addCommentInput,
    replyCountSWR = null,
    replySWR = null,
    shouldShowThread = false,
    setTopLevel = null,
    mutateCount = null,
}) => {

    const router = useRouter();

    const { address } = useContext(WalletContext);
    const { nft } = useContext(NftContext);

    const likesCount = useLikeCount(comment.id, "comment");

    const [deleteComment] = useDeleteComment();
    const [showThread, setShowThread] = useState(shouldShowThread);

    // SWRs

    // If we have a top level COMMENT, then we'll use the SWR passed in (as we need to use EXACTLY the same bound mutate function for things to work)
    // If we have a top level NFT, then we'll use the internal SWRs here to get the replies, and reply count for the comment

    // we can't conditionally call react hooks. hence the double assignment
    const internalSWR = useComments(comment.id, 10, "comment", null, showThread);
    const swr = replySWR || internalSWR;

    // we can't conditionally call react hooks. hence the double assignment
    const internalCountSWR = useCommentCount(comment.id, "comment", null);
    const countSWR = replyCountSWR || internalCountSWR;

    const canDeleteComment = (comment: HodlCommentViewModel) => comment.user.address === address || nft?.owner === address;

    return (
        <Box display="flex" flexDirection="column" gap={1}>
            <Box
                display="flex"
                flexDirection="column"
                gap={0.5}
                sx={{
                    paddingY: 1,
                }}
            >
                <Box
                    display="flex"
                    alignItems="start"
                    gap={2}
                    flexGrow={1}
                    id={`hodl-comments-${comment.id}`}>
                    <Box
                        display="flex"
                        alignItems="start"
                        gap={2}
                        flexGrow={1}
                    >
                        <UserAvatarAndHandle
                            address={comment.user.address}
                            fallbackData={comment.user}
                            handle={false}
                        />
                        <Box
                            display="flex"
                            flexDirection="column"
                            flexWrap="wrap"
                            gap={0.5}
                        >
                            <Box
                                display="flex"
                                flexDirection="column"
                                flexWrap="wrap"
                                gap={0}
                            >
                                <ProfileNameOrAddress
                                    profileAddress={comment.user.address}
                                    fallbackData={comment.user}
                                />
                                <Typography>{comment.comment}</Typography>
                            </Box>
                            <Box display="flex" gap={0.5}>
                                <Typography sx={{ fontSize: 10, color: "#999" }}>{likesCount} likes</Typography>
                                <Typography sx={{ fontSize: 10, color: "#999" }}>{countSWR.data} replies</Typography>
                                <Typography sx={{ fontSize: 10, color: "#999" }}>{comment.timestamp && formatDistanceStrict(new Date(comment.timestamp), new Date(), { addSuffix: false })}</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box display="flex" gap={1}>
                        {address &&
                            <Likes
                                color="inherit"
                                sx={{
                                    cursor: 'pointer',
                                    color: '#999',
                                    '&:hover': {
                                        color: '#333',
                                    }
                                }}
                                fontSize="16px"
                                id={comment.id}
                                object="comment"
                                showCount={false}
                                likeTooltip={'Like this Comment'}
                                unlikeTooltip={'Stop liking this Comment'}
                            />
                        }
                        {address &&
                            <Tooltip title="Reply to this Comment">
                                <Reply
                                    sx={{
                                        cursor: 'pointer',
                                        color: '#999',
                                        '&:hover': {
                                            color: '#333',
                                        },
                                        fontSize: "16px"
                                    }}

                                    onClick={() => {
                                        setCommentingOn({
                                            object: "comment",
                                            objectId: comment.id,
                                            mutateList: swr.mutate,
                                            mutateCount: countSWR.mutate,
                                            setShowThread,
                                            color
                                        })
                                        addCommentInput?.focus();
                                    }
                                    } />
                            </Tooltip>
                        }
                        <Tooltip title="View Single Comment Thread">
                            <Message
                                sx={{
                                    cursor: 'pointer',
                                    color: '#999',
                                    '&:hover': {
                                        color: '#333',
                                    },
                                    fontSize: "16px"
                                }}
                                fontSize="inherit"
                                onClick={() => {
                                    setTopLevel({ objectId: comment.id, object: "comment" });
                                    router.push({
                                        pathname: window.location.pathname,
                                        query: { comment: comment.id }
                                    }, undefined, { shallow: true });
                                }}
                            />
                        </Tooltip>
                        {
                            address && canDeleteComment(comment) &&
                            <Tooltip title="Delete this Comment">
                                <HighlightOffOutlined
                                    sx={{
                                        cursor: 'pointer',
                                        color: '#999',
                                        '&:hover': {
                                            color: '#333',
                                        },
                                        fontSize: "16px"
                                    }}
                                    fontSize="inherit"
                                    onClick={async () => {
                                        await deleteComment(comment);
                                        parentMutateList();
                                        parentMutateCount();
                                        mutateCount();
                                    }
                                    }
                                />
                            </Tooltip>
                        }
                    </Box>
                </Box>
            </Box>
            {
                Boolean(countSWR.data) &&
                <Box
                    display="flex"
                    flexDirection="column"
                    gap={1}
                    marginLeft={'55px'}
                >
                    {showThread && !swr.error && !swr.data ?
                        <Typography
                            sx={{
                                fontSize: 10,
                                color: "#999",
                                cursor: 'pointer'
                            }}
                        >
                            Loading...
                        </Typography> :
                        <Typography
                            sx={{
                                fontSize: 10,
                                color: "#999",
                                cursor: 'pointer',
                                '&:hover': {
                                    color: '#333',
                                }
                            }}
                            onClick={() => setShowThread(old => !old)}
                        >
                            {!showThread ? 'Show Replies...' : 'Hide Replies...'}
                        </Typography>
                    }
                    {
                        (<>
                            {
                                showThread && swr?.data?.map(({ items, next, total }) => (<>
                                    <Box key={next} display="flex" flexDirection="column" gap={1.5}> {
                                        (items || []).map(
                                            (comment: HodlCommentViewModel, i: number) => (<HodlCommentBox
                                                key={`hodl-comments-${comment.id}`}
                                                comment={comment}
                                                color={i % 2 ? 'primary' : 'secondary'}
                                                setCommentingOn={setCommentingOn}
                                                addCommentInput={addCommentInput}
                                                parentMutateList={swr.mutate}
                                                parentMutateCount={countSWR.mutate}
                                                setTopLevel={setTopLevel}
                                                mutateCount={mutateCount}
                                            />)
                                        )
                                    }</Box>
                                </>
                                )
                                )
                            }
                            {
                                swr.data &&
                                swr.data.length &&
                                swr.data[swr.data.length - 1].next !== swr.data[swr.data.length - 1].total &&
                                <Typography
                                    sx={{
                                        fontSize: 10,
                                        color: "#999",
                                        cursor: 'pointer',
                                        marginY: 1,
                                        marginLeft: '20px'
                                    }}
                                    onClick={() => swr.setSize(old => old + 1)}
                                >
                                    View More Replies...
                                </Typography>}
                        </>
                        )
                    }
                </Box>
            }
        </Box>
    );
};
