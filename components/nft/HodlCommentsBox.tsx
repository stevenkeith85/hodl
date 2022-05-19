import { Card, CardContent, Typography, Chip, Box, Link, Stack } from "@mui/material";
import { useRouter } from "next/router";
import axios from 'axios';
import useSWR, { useSWRConfig } from "swr";
import { useContext, useRef } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { Formik, Form, Field } from "formik";
import { TextField, InputBase } from 'formik-mui';
import { AddTagValidationSchema } from "../../validationSchema/addTag";
import { MAX_TAGS_PER_TOKEN, truncateText } from "../../lib/utils";
import { token } from "../../lib/copyright";
import address from "../../pages/api/profile/address";
import { ProfileAvatar } from "../ProfileAvatar";
import theme from "../../theme";
import { HodlComment } from "../../pages/api/comments/models";
import formatDistance from 'date-fns/formatDistance';

const HodlComment = ({ comment, color = "secondary" }) => {
    return (
        <Box marginY={1}>
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

export const HodlCommentsBox = ({ nft, prefetchedComments }) => {
    const { mutate } = useSWRConfig()
    const newTagRef = useRef();
    const { address } = useContext(WalletContext);

    const { data: comments, mutate: mutateComments } = useSWR(nft.tokenId ? [`/api/comments`, nft.tokenId] : null,
        (url, token) => axios.get(`${url}/${token}`).then(r => r.data),
        { fallbackData: prefetchedComments }
    );

    const isOwner = () => Boolean(nft?.owner?.toLowerCase() === address?.toLowerCase());

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h3" sx={{ marginBottom: 2 }}>Comments</Typography>
                <Box sx={{
                    maxHeight: '250px',
                    overflow: 'auto'
                }}>
                    {comments?.length ?
                        comments.map((comment, i) => <HodlComment comment={comment} key={comment.comment} color={i % 2 ? 'primary' : 'secondary'} />) :
                        <Typography sx={{ color: '#999' }}>It&apos;s, oh, so quiet...</Typography>
                    }
                </Box>
                {address && <Formik
                    initialValues={{
                        comment: '',
                        token: nft.tokenId
                    }}
                    // validationSchema={AddTagValidationSchema}
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
                    {({ setFieldValue, errors }) => (
                        <Form>
                            <Field
                                autoComplete='off'
                                inputRef={newTagRef}
                                component={InputBase}
                                sx={{ width: '100%', border: `1px solid #ccc`, borderRadius: 1, marginTop: 2, paddingX: 1.5, paddingY: 0.25 }}
                                placeholder="add comment"
                                name="comment"
                                id="hodlCommentsBox-comment"
                                type="text"
                            />
                        </Form>
                    )}
                </Formik>}
            </CardContent>
        </Card>
    )
}