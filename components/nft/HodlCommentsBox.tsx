import { Card, CardContent, Typography, Chip, Box, Link, Stack } from "@mui/material";
import { useRouter } from "next/router";
import axios from 'axios';
import useSWR, { useSWRConfig } from "swr";
import { useContext, useEffect, useRef } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { Formik, Form, Field } from "formik";
import { TextField, InputBase } from 'formik-mui';
import { AddTagValidationSchema } from "../../validationSchema/addTag";
import { MAX_TAGS_PER_TOKEN, truncateText } from "../../lib/utils";
import { token } from "../../lib/copyright";
import address from "../../pages/api/profile/address";
import { ProfileAvatar } from "../ProfileAvatar";
import theme from "../../theme";
import { HodlComment } from "../../models/HodlComment";
import formatDistance from 'date-fns/formatDistance';
import { CommentValidationSchema } from "../../validationSchema/comments";
import { Calculate, Delete, DeleteForever, DeleteOutlined, HighlightOffOutlined } from "@mui/icons-material";
import { yellow } from '@mui/material/colors';

const HodlComment = ({ comment, color = "secondary", sx = {} }) => {
    const router = useRouter();

    const selected = router?.query?.comment === `${comment.subject}-${comment.timestamp}`;
    
    return (
        <Box paddingY={0.5} sx={{ background: selected ? yellow[100] : 'none', ...sx }} id={`hodl-comments-${comment.subject}-${comment.timestamp}`}>
            <Stack direction="row" spacing={1} display="flex" alignItems="center">
                <ProfileAvatar profileAddress={comment.subject} size="small" />
                <Box display="flex" alignItems="center">
                    <Typography
                        sx={{
                            color: theme => theme.palette[color].light,
                            span: { fontSize: 10, color: "#999" }
                        }}>
                        &quot;{comment.comment}&quot;
                        <span> {comment.timestamp && formatDistance(new Date(comment.timestamp), new Date(), { addSuffix: false })}</span>
                    </Typography>
                </Box>
            </Stack>
        </Box>
    )
}

interface HodlCommentsBoxProps {
    nft: any, 
    prefetchedComments: any
}

export const HodlCommentsBox: React.FC<HodlCommentsBoxProps> = ({ 
    nft, 
    prefetchedComments
}) => {
    const router = useRouter();
    const { mutate } = useSWRConfig()
    const newTagRef = useRef();
    const { address } = useContext(WalletContext);

    const { data: comments, mutate: mutateComments } = useSWR(nft.tokenId ? [`/api/comments`, nft.tokenId] : null,
        (url, token) => axios.get(`${url}/${token}`).then(r => r.data),
        { fallbackData: prefetchedComments }
    );

    const { data: count } = useSWR(nft.tokenId ? [`/api/comments/count`, nft.tokenId] : null,
        (url, tokenId) => axios.get(`${url}?token=${tokenId}`).then(r => r.data.count));

    const canDeleteComment = (comment) => Boolean(nft?.owner?.toLowerCase() === address?.toLowerCase() || comment.subject === address)

    const deleteComment = async (comment) => {
        try {

            mutateComments(old => old.filter(c => c !== comment), { revalidate: false });
            mutate([`/api/comments/count`, nft.tokenId], old => old - 1, { revalidate: false })
            const r = await axios.delete(
                '/api/comments/delete',
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': localStorage.getItem('jwt')
                    },
                    data: comment,

                });
        } catch (error) {
            mutateComments();
            mutate([`/api/comments/count`, nft.tokenId]);
        }
    }

    useEffect(() => {
        if (router.query.comment) {
            setTimeout(() =>{
                document.querySelector(`#hodl-comments-${router.query.comment}`)?.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
            }, 1000)
        }
    }, []);

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h3" sx={{ marginBottom: 2 }}>Comments ({ count })</Typography>
                <Box sx={{
                    maxHeight: '250px',
                    overflow: 'auto'
                }}>
                    {comments?.length ?
                        comments.map(
                            (comment, i) =>
                            <Box display="flex" alignItems="center">
                                <HodlComment comment={comment} key={comment.comment} color={i % 2 ? 'primary' : 'secondary'} sx={{ flexGrow: 1 }} />
                                {canDeleteComment(comment) && <Box p={1} color="#999"><HighlightOffOutlined fontSize="small" onClick={() => deleteComment(comment)} /></Box>}
                            </Box>
                        )
                        :
                        <Typography sx={{ color: '#999' }}>It&apos;s, oh, so quiet...</Typography>
                    }
                </Box>
                {address && <Formik
                    initialValues={{
                        comment: '',
                        token: nft.tokenId
                    }}
                    validationSchema={CommentValidationSchema}
                    onSubmit={async (values) => {
                        try {
                            const newComment: HodlComment = { subject: address, comment: values.comment, token: nft.tokenId, timestamp: Date.now() }
                            mutateComments(old => [newComment, ...old], { revalidate: false });
                            mutate([`/api/comments/count`, nft.tokenId], old => old + 1, { revalidate: false })
                            const r = await axios.post(
                                '/api/comments/add',
                                {
                                    comment: values.comment,
                                    token: values.token
                                },
                                {
                                    headers: {
                                        'Accept': 'application/json',
                                        'Authorization': localStorage.getItem('jwt')
                                    }
                                });
                            values.comment = '';
                            setTimeout(() => {
                                // @ts-ignore
                                newTagRef?.current?.focus();
                            })

                        } catch (error) {
                            mutateComments();
                            mutate([`/api/comments/count`, nft.tokenId]);
                        }
                    }}
                >
                    {({ errors, values }) => (
                        <>
                            <Form>
                                <Box display="flex" alignItems="center" marginTop={2}>
                                    <Field
                                        validateOnChange
                                        autoComplete='off'
                                        inputRef={newTagRef}
                                        component={InputBase}
                                        sx={{ flexGrow: 1, border: errors.comment ? theme => `1px solid ${theme.palette.error.main}` : `1px solid #ccc`, borderRadius: 1,  paddingX: 1.5 }}
                                        placeholder="add comment"
                                        name="comment"
                                        id="hodl-comments-add"
                                        type="text"
                                    />
                                    <Typography sx={{ textAlign: 'right', fontSize: 10,  paddingLeft: 0.75 }}>{values?.comment?.length} / 150</Typography>
                                </Box>
                                <Typography sx={{ fontSize: 10, paddingTop: 0.5 }}>{errors.comment}</Typography>
                            </Form>
                        </>)}
                </Formik>}
            </CardContent>
        </Card>
    )
}