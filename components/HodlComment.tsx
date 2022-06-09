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
import { useComments } from "../hooks/useComments";
import { useState } from "react";
import { InfiniteScrollComments } from "./profile/InfiniteScrollComments";

export const HodlComment = ({ comment, color = "secondary", canDeleteComment, deleteComment, setCommentingOn, sx = {} }) => {
    const router = useRouter();

    const selected = router?.query?.comment == comment.id;

    const { data: profileNickname } = useSWR(comment.subject ? [`/api/profile/nickname`, comment.subject] : null,
        (url, query) => axios.get(`${url}?address=${query}`).then(r => r.data.nickname))

    const [tokenLikesCount] = useLike(comment.id, false);
    const [loading, setLoading] = useState(false);
    const [swr, _, __, count] = useComments(comment.id, 5, setLoading, false, null, null);

    console.log('comment', comment.id, swr.data)

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
                onClick={() => setCommentingOn({
                    token: false,
                    id: comment.id
                })} />
            <Likes
                id={comment.id}
                token={false}
                fontSize="inherit"
                showCount={false}
            />
            {
                canDeleteComment(comment) &&
                <HighlightOffOutlined sx={{ cursor: 'pointer', color: '#999' }} fontSize="inherit" onClick={() => deleteComment(comment)} />
            }
        </Box>
        <Box marginLeft={'50px'}>
            <InfiniteScrollComments swr={swr} limit={5} canDeleteComment={canDeleteComment} deleteComment={deleteComment} setCommentingOn={setCommentingOn}/>
        </Box>
        </>
    );
};
