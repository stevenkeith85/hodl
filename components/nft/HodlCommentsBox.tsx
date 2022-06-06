import { Card, CardContent, Typography, Box, Tooltip, Badge } from "@mui/material";
import { useRouter } from "next/router";
import axios from 'axios';
import useSWR, { useSWRConfig } from "swr";
import { useContext, useEffect, useRef, useState } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { Formik, Form, Field } from "formik";
import { InputBase } from 'formik-mui';
import { HodlComment } from "../../models/HodlComment";
import { CommentValidationSchema } from "../../validationSchema/comments";
import { useComments } from "../../hooks/useComments";
import { InfiniteScrollComments } from "../profile/InfiniteScrollComments";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";

interface HodlCommentsBoxProps {
    nft: any,
    prefetchedComments: any,
    prefetchedCommentCount: number,
    limit: number
}

export const HodlCommentsBox: React.FC<HodlCommentsBoxProps> = ({
    nft,
    prefetchedComments,
    prefetchedCommentCount,
    limit
}) => {
    const router = useRouter();
    const { mutate } = useSWRConfig()
    const newTagRef = useRef();
    const { address } = useContext(WalletContext);
    const [loading, setLoading] = useState(false);

    const [swr] = useComments(nft.tokenId, limit, prefetchedComments);

    const { data: count } = useSWR(nft.tokenId ? [`/api/comments/count`, nft.tokenId] : null,
        (url, tokenId) => axios.get(`${url}?token=${tokenId}`).then(r => r.data.count),
        { fallbackData: prefetchedCommentCount }
    );

    const canDeleteComment = (comment) => Boolean(nft?.owner?.toLowerCase() === address?.toLowerCase() || comment.subject === address)

    const deleteComment = async (comment) => {
        try {
            setLoading(true)
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
            swr.mutate();
            setLoading(false);
        } catch (error) {
            swr.mutate();
            mutate([`/api/comments/count`, nft.tokenId]);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (router.query.comment) {
            setTimeout(() => {
                document.querySelector(`#hodl-comments-${router.query.comment}`)?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
            }, 1000)
        }
    }, []);

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h3" sx={{ marginBottom: 2 }}>Comments <Badge sx={{ p: '6px 3px' }} showZero badgeContent={count}></Badge></Typography>
                <Box sx={{
                    maxHeight: '250px',
                    overflow: 'auto',
                    position: 'relative'
                }}>
                    {swr?.data && swr?.data[0]?.total === 0 &&
                        <Typography sx={{ color: '#999' }}>It&apos;s, oh, so quiet...</Typography>
                    }
                    { loading && <Box sx={{ 
                        position: 'absolute', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        width: '100%',
                        height: '100%',
                        }}>
                            <HodlLoadingSpinner /> 
                        </Box>
                    }
                    <InfiniteScrollComments swr={swr} limit={limit} canDeleteComment={canDeleteComment} deleteComment={deleteComment} />

                </Box>
                {address && <Formik
                    initialValues={{
                        comment: '',
                        token: nft.tokenId
                    }}
                    validationSchema={CommentValidationSchema}
                    onSubmit={async (values) => {
                        try {
                            setLoading(true)
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
                            swr.mutate();
                            setLoading(false)
                            values.comment = '';
                            setTimeout(() => {
                                // @ts-ignore
                                newTagRef?.current?.focus();
                            })
                        } catch (error) {
                            swr.mutate();
                            mutate([`/api/comments/count`, nft.tokenId]);
                            setLoading(false);
                        }
                    }}
                >
                    {({ errors, values }) => (
                        <>
                            <Form>
                                <Box display="flex" alignItems="center" marginTop={2}>
                                    <Tooltip title={errors?.comment || ''} >
                                        <Field
                                            validateOnChange
                                            autoComplete='off'
                                            inputRef={newTagRef}
                                            component={InputBase}
                                            sx={{ flexGrow: 1, border: errors.comment ? theme => `1px solid ${theme.palette.error.main}` : `1px solid #ccc`, borderRadius: 1, paddingX: 1.5 }}
                                            placeholder="add comment"
                                            name="comment"
                                            id="hodl-comments-add"
                                            type="text"
                                        />
                                    </Tooltip>
                                    <Typography sx={{ textAlign: 'right', fontSize: 10, paddingLeft: 0.75 }}>{values?.comment?.length} / 150</Typography>
                                </Box>
                            </Form>
                        </>)}
                </Formik>}
            </CardContent>
        </Card>
    )
}