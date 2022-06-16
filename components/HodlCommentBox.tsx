import { Typography, Box, Stack, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import { ProfileAvatar } from "./ProfileAvatar";
import formatDistance from 'date-fns/formatDistance';
import Link from 'next/link';
import axios from 'axios'
import useSWR from "swr";
import { getShortAddress, truncateText } from "../lib/utils";
import { Likes } from "./Likes";
import { HighlightOffOutlined, Message, Notes, Reply } from "@mui/icons-material";
import { useLike } from "../hooks/useLike";
import { useComments, useCommentCount, useDeleteComment } from "../hooks/useComments";
import { FC, useContext, useState } from "react";
import { HodlComment } from "../models/HodlComment";
import { WalletContext } from "../contexts/WalletContext";

interface HodlCommentBoxProps {
    comment: HodlComment;
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
    setTopLevel = null
}) => {

    const router = useRouter();
    const { address } = useContext(WalletContext);

    const { data: profileNickname } = useSWR(
        comment.subject ? [`/api/profile/nickname`, comment.subject] : null,
        (url, query) => axios.get(`${url}?address=${query}`).then(r => r.data.nickname),
        { revalidateOnMount: true }
    )

    // Comment Metadata
    const [likesCount] = useLike(comment.id, false);

    // Actions
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

    // TODO: We should probably store the nft id the comment was on. 
    // This will make it easier to link to it in notifications, 
    // and we can check whether the token owner wants to delete things on their token.
    // iterating up the comment tree will be too slow
    const canDeleteComment = () => true;

    return (
        <>
            <Box
                display="flex"
                gap={1.5}
                alignItems="top"
                sx={{
                    background: '#fafafa',
                    padding: 1.5,
                    borderRadius: 1,
                    border: '1px solid #f0f0f0'
                }}
            >
                <Box
                    display="flex"
                    alignItems="start"
                    gap={1.5}
                    flexGrow={1}
                    id={`hodl-comments-${comment.id}`}
                >
                    <ProfileAvatar profileAddress={comment.subject} size="small" showNickname={false} />

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
                            {
                                profileNickname ?
                                    <Link href={`/profile/${profileNickname}`}>
                                        <Typography sx={{ color: theme => theme.palette[color].light, cursor: 'pointer' }}>{truncateText(profileNickname, 20)}</Typography>
                                    </Link>
                                    :
                                    <Link href={`/profile/${comment.subject}`}>
                                        <Tooltip title={comment.subject}>
                                            <Typography sx={{ color: theme => theme.palette[color].light, cursor: 'pointer' }}>{getShortAddress(comment.subject)?.toLowerCase()}</Typography>
                                        </Tooltip>
                                    </Link>
                            }
                            <Typography>
                                {comment.comment}
                            </Typography>

                        </Box>
                        <Box display="flex" gap={1}>
                            <Typography sx={{ fontSize: 10, color: "#999" }}>{likesCount} likes</Typography>
                            <Typography sx={{ fontSize: 10, color: "#999" }}>|</Typography>
                            <Typography sx={{ fontSize: 10, color: "#999" }}>{countSWR.data} replies</Typography>
                            <Typography sx={{ fontSize: 10, color: "#999" }}>|</Typography>
                            <Typography sx={{ fontSize: 10, color: "#999" }}>{comment.timestamp && formatDistance(new Date(comment.timestamp), new Date(), { addSuffix: true })}</Typography>
                        </Box>
                    </Box>
                </Box>
                {address &&
                    <Tooltip title="Reply to this Comment">
                        <Reply
                            sx={{
                                cursor: 'pointer',
                                color: '#999',
                                '&:hover': {
                                    color: '#333',
                                }
                            }}
                            fontSize="inherit"
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
                            id={comment.id}
                            token={false}
                            fontSize="inherit"
                            showCount={false}
                            likeTooltip={'Like this Comment'}
                            unlikeTooltip={'Stop liking this Comment'}
                        />
                }
                <Tooltip title="View Single Comment Thread">
                    <Message
                        sx={{
                            cursor: 'pointer',
                            color: '#999',
                            '&:hover': {
                                color: '#333',
                            }
                        }}
                        fontSize="inherit"
                        onClick={() => {
                            if (setTopLevel !== null) {
                                setTopLevel({ objectId: comment.id, object: "comment" });
                            } else {
                                router.push({
                                    pathname: window.location.pathname,
                                    query: { comment: comment.id }
                                });
                            }
                        }}
                    />
                </Tooltip>
                {
                    address && canDeleteComment() &&
                    <Tooltip title="Delete this Comment">
                        <HighlightOffOutlined
                            sx={{
                                cursor: 'pointer',
                                color: '#999',
                                '&:hover': {
                                    color: '#333',
                                }
                            }}
                            fontSize="inherit"
                            onClick={
                                () => deleteComment(
                                    comment,
                                    parentMutateList,
                                    parentMutateCount
                                )
                            }
                        />
                    </Tooltip>
                }
            </Box>
            {
                Boolean(countSWR.data) &&
                <Box
                    display="flex"
                    flexDirection="column"
                    gap={1}
                    marginLeft={'45px'}
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
                                swr?.data?.map(({ items, next, total }) => (<>
                                    <Box key={next} display="flex" flexDirection="column" gap={1.5}> {
                                        (items || []).map(
                                            (comment: HodlComment, i: number) => (<HodlCommentBox
                                                key={`hodl-comments-${comment.id}`}
                                                comment={comment}
                                                color={i % 2 ? 'primary' : 'secondary'}
                                                setCommentingOn={setCommentingOn}
                                                addCommentInput={addCommentInput}
                                                parentMutateList={swr.mutate}
                                                parentMutateCount={countSWR.mutate}
                                                setTopLevel={setTopLevel}
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
                                        marginLeft: '45px'
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
        </>
    );
};
