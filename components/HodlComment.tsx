import { Typography, Box, Stack, Link, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import { ProfileAvatar } from "./ProfileAvatar";
import formatDistance from 'date-fns/formatDistance';
import { yellow } from '@mui/material/colors';
import axios from 'axios'
import useSWR from "swr";
import { getShortAddress, truncateText } from "../lib/utils";
import { Likes } from "./Likes";
import { HighlightOffOutlined, Reply } from "@mui/icons-material";
import { useLike } from "../hooks/useLike";
import { useComments, useCommentCount, useDeleteComment } from "../hooks/useComments";
import { useState } from "react";


export const HodlComment = ({ nft, comment, color = "secondary", canDeleteComment, setCommentingOn, addCommentInput, parentMutateList, parentMutateCount, sx = {} }) => {
    
    const router = useRouter();

    const selected = router?.query?.comment == comment.id;

    const { data: profileNickname } = useSWR(
        comment.subject ? [`/api/profile/nickname`, comment.subject] : null,
        (url, query) => axios.get(`${url}?address=${query}`).then(r => r.data.nickname),
        { revalidateOnMount: true }
    )

    const [tokenLikesCount] = useLike(comment.id, false);

    const [showThread, setShowThread] = useState(false);

    const [count, mutateCount] = useCommentCount(comment.id, "comment", null);
    const swr = useComments(comment.id, 10, "comment", null, showThread);
    const [deleteComment] = useDeleteComment();

    return (
        <>
            <Box
                display="flex"
                gap={1}
                alignItems="center"
                sx={{
                    background: selected ? yellow[100] : 'none',
                    ...sx
                }}
            >
                <Box
                    display="flex"
                    alignItems="start"
                    gap={1}
                    flexGrow={1}
                    id={`hodl-comments-${comment.id}`}
                >
                    <ProfileAvatar profileAddress={comment.subject} size="small" showNickname={false} />
                    <Box display="flex" flexDirection="column">
                        <Box display="flex" flexDirection="column" flexWrap="wrap">
                            {
                                profileNickname ?
                                    <Typography sx={{ color: theme => theme.palette[color].light }}>{truncateText(profileNickname, 20)}</Typography> :
                                    <Tooltip title={comment.subject}>
                                        <Typography sx={{ color: theme => theme.palette[color].light }}>{getShortAddress(comment.subject)?.toLowerCase()}</Typography>
                                    </Tooltip>
                            }
                            <Typography>
                                {comment.comment}
                            </Typography>
                        </Box>
                        <Box display="flex" gap={1}>
                            <Typography sx={{ fontSize: 10, color: "#999" }}>{tokenLikesCount} likes</Typography>
                            <Typography sx={{ fontSize: 10, color: "#999" }}>|</Typography>
                            <Typography sx={{ fontSize: 10, color: "#999" }}>{count} replies</Typography>
                            <Typography sx={{ fontSize: 10, color: "#999" }}>|</Typography>
                            <Typography sx={{ fontSize: 10, color: "#999" }}>{comment.timestamp && formatDistance(new Date(comment.timestamp), new Date(), { addSuffix: false })}</Typography>
                        </Box>

                    </Box>
                </Box>
                <Reply
                    fontSize="inherit"
                    onClick={() => {
                        setCommentingOn({
                            object: "comment",
                            objectId: comment.id,
                            mutateList: swr.mutate,
                            mutateCount: mutateCount,
                            setShowThread
                        })
                        addCommentInput?.focus();
                    }
                    } />
                <Likes
                    id={comment.id}
                    token={false}
                    fontSize="inherit"
                    showCount={false}
                />
                {
                    canDeleteComment(comment) &&
                    <HighlightOffOutlined
                        sx={{ cursor: 'pointer', color: '#999' }}
                        fontSize="inherit"
                        onClick={
                            () => deleteComment(
                                comment,
                                parentMutateList,
                                parentMutateCount
                            )
                        }
                    />
                }
            </Box>
            {Boolean(count) && <Box
                display="flex"
                flexDirection="column"
                gap={1}
                marginLeft={'45px'}>

                {showThread && !swr.error && !swr.data ?
                    <Typography sx={{ fontSize: 10, color: "#999", cursor: 'pointer' }}>
                        Loading...
                    </Typography> :
                    <Typography sx={{ fontSize: 10, color: "#999", cursor: 'pointer' }} onClick={() => setShowThread(old => !old)}>
                        {!showThread ? 'Show Replies...' : 'Hide Replies...'}
                    </Typography>
                }
                {
                    (<>
                        {
                            swr?.data?.map(({ items, next, total }) => (<>
                                <Box key={next} display="flex" flexDirection="column" gap={1}> {
                                    (items || []).map(
                                        (comment, i) => (<HodlComment
                                            nft={nft}
                                            key={`hodl-comments-${comment.id}`}
                                            comment={comment}
                                            color={i % 2 ? 'primary' : 'secondary'}
                                            canDeleteComment={canDeleteComment}
                                            setCommentingOn={setCommentingOn}
                                            sx={{ flexGrow: 1 }}
                                            addCommentInput={addCommentInput}
                                            parentMutateList={swr.mutate}
                                            parentMutateCount={mutateCount}
                                        />)
                                    )
                                }</Box>

                            </>
                            )
                            )
                        }
                        {swr.data && swr.data.length && swr.data[swr.data.length - 1].next !== swr.data[swr.data.length - 1].total && <Typography
                            sx={{ fontSize: 10, color: "#999", cursor: 'pointer', marginY: 1, marginLeft: '45px' }}
                            onClick={() => swr.setSize(old => old + 1)}
                        >
                            View More Replies...
                        </Typography>}
                    </>
                    )
                }
            </Box>}
        </>
    );
};
