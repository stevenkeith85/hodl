import { Typography, Box, Stack, Link, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import { ProfileAvatar } from "./ProfileAvatar";
import formatDistance from 'date-fns/formatDistance';
import { yellow } from '@mui/material/colors';
import axios from 'axios'
import useSWR from "swr";
import { getShortAddress, truncateText } from "../lib/utils";
import { Likes } from "./Likes";
import { HighlightOffOutlined, Notes, Reply } from "@mui/icons-material";
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
    const swr = replySWR || useComments(comment.id, 10, "comment", null, showThread);
    const countSWR = replyCountSWR || useCommentCount(comment.id, "comment", null);

    // TODO: We should probably store the nft id the comment was on. 
    // This will make it easier to link to it in notifications, 
    // and we can check whether the token owner wants to delete things on their token.
    // iterating up the comment tree will be too slow
    const canDeleteComment = () => true;

    return (
        <>
            <Box
                display="flex"
                gap={1}
                alignItems="center"
            // sx={{
            //     background: selected ? yellow[100] : 'none'
            // }}
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
                            <Typography sx={{ fontSize: 10, color: "#999" }}>{likesCount} likes</Typography>
                            <Typography sx={{ fontSize: 10, color: "#999" }}>|</Typography>
                            <Typography sx={{ fontSize: 10, color: "#999" }}>{countSWR.data} replies</Typography>
                            <Typography sx={{ fontSize: 10, color: "#999" }}>|</Typography>
                            <Typography sx={{ fontSize: 10, color: "#999" }}>{comment.timestamp && formatDistance(new Date(comment.timestamp), new Date(), { addSuffix: false })}</Typography>
                        </Box>

                    </Box>
                </Box>
                { address && <Reply
                    fontSize="inherit"
                    onClick={() => {
                        setCommentingOn({
                            object: "comment",
                            objectId: comment.id,
                            mutateList: swr.mutate,
                            mutateCount: countSWR.mutate,
                            setShowThread
                        })
                        addCommentInput?.focus();
                    }
                    } />}
                { address && <Likes
                    id={comment.id}
                    token={false}
                    fontSize="inherit"
                    showCount={false}
                />}
                <Notes
                    sx={{ cursor: 'pointer', color: '#999' }}
                    fontSize="inherit"
                    onClick={() => {
                        if (setTopLevel !== null) {
                            setTopLevel({objectId: comment.id, object: "comment"});
                        } else {
                            router.push({
                                pathname: window.location.pathname,
                                query: { comment: comment.id }
                            });
                        }
                    }}
                />
                {
                    address && canDeleteComment() &&
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
                                cursor: 'pointer'
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
                                    <Box key={next} display="flex" flexDirection="column" gap={1}> {
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
                </Box>}
        </>
    );
};
