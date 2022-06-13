import { Card, CardContent, Typography, Box, Tooltip, Badge } from "@mui/material";
import { useRouter } from "next/router";
import axios from 'axios';
import useSWR, { useSWRConfig } from "swr";
import { useContext, useEffect, useRef, useState } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { Formik, Form, Field } from "formik";
import { InputBase } from 'formik-mui';
import { AddCommentValidationSchema } from "../../validationSchema/comments/addComments";
import { useAddComment, useCommentCount, useComments } from "../../hooks/useComments";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import { CommentThread } from "../comments/CommentThread";
import { BackspaceOutlined, HighlightOffOutlined } from "@mui/icons-material";
import { HodlComment } from "../../models/HodlComment";
import { fetchWithId } from "../../lib/swrFetchers";

interface HodlCommentsBoxProps {
    nft: any,
    prefetchedComments: any,
    prefetchedCommentCount: number,
    limit: number,
    maxHeight?: string
}

export const HodlCommentsBox: React.FC<HodlCommentsBoxProps> = ({
    nft,
    prefetchedComments,
    prefetchedCommentCount,
    limit,
    maxHeight = '350px'
}) => {
    const router = useRouter();
    const newTagRef = useRef();
    const { address } = useContext(WalletContext);
    const [loading, setLoading] = useState(false);

    const swr = useComments(nft.tokenId, limit, "token", prefetchedComments);

    const [count, mutateCount] = useCommentCount(nft.tokenId, "token", prefetchedCommentCount);
    const [addComment] = useAddComment();

    const [commentingOn, setCommentingOn] = useState<{ object: "token" | "comment", objectId: number, mutateList: Function, mutateCount: Function }>({
        object: "token",
        objectId: nft.tokenId,
        mutateList: swr.mutate,
        mutateCount: mutateCount
    });

    const { data: comment } = useSWR(commentingOn.objectId ? [`/api/comment`, commentingOn.objectId] : null, fetchWithId);

    const { data: commenter } = useSWR(
        comment && comment.subject ? [`/api/profile/nickname`, comment.subject] : null,
        (url, query) => axios.get(`${url}?address=${query}`).then(r => r.data.nickname),
        { revalidateOnMount: true }
    )

    useEffect(() => {
        if (router.query.comment) {
            setTimeout(() => {
                document.querySelector(`#hodl-comments-${router.query.comment}`)?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
            }, 300)
        }
    }, [router.query.comment]);

    return (
        <>
            <Card variant="outlined">
                <CardContent>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="h3" sx={{ marginBottom: 2 }}>Comments <Badge sx={{ p: '6px 3px' }} showZero badgeContent={count} max={1000}></Badge></Typography>
                    </Box>
                    <Box sx={{ maxHeight, minHeight: maxHeight, overflow: 'auto', position: 'relative' }}>
                        {loading && <Box sx={{
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
                        <CommentThread
                            nft={nft}
                            limit={limit}
                            setCommentingOn={setCommentingOn}
                            swr={swr}
                            addCommentInput={newTagRef?.current}
                            parentMutateCount={mutateCount}
                        />
                    </Box>
                    {address && <Formik
                        initialValues={{
                            comment: '',
                            id: commentingOn.objectId
                        }}
                        validationSchema={AddCommentValidationSchema}
                        onSubmit={async (values) => {
                            const comment: HodlComment = {
                                object: commentingOn.object,
                                objectId: commentingOn.objectId,
                                subject: address,
                                comment: values.comment,
                            }
                            setLoading(true)
                            await addComment(
                                comment,
                                commentingOn.mutateList,
                                commentingOn.mutateCount);
                            setLoading(false);
                            values.comment = '';
                            // setTimeout(() => {
                            //     // @ts-ignore
                            //     newTagRef?.current?.focus();
                            // })
                        }}
                    >
                        {({ errors, values }) => (
                            <>
                                {/* {JSON.stringify(errors)} */}
                                <Form>
                                    <Box display="flex" alignItems="center" marginTop={2}>
                                        <Tooltip title={errors?.comment || ''} >
                                            <Box display="flex" flexDirection="column" position="relative" flexGrow={1}>
                                                <Field
                                                    validateOnChange
                                                    autoComplete='off'
                                                    inputRef={newTagRef}
                                                    component={InputBase}
                                                    sx={{ flexGrow: 1, border: errors.comment ? theme => `1px solid ${theme.palette.error.main}` : `1px solid #ccc`, borderRadius: 1, paddingX: 1.5, paddingRight: 3 }}
                                                    placeholder={
                                                        commentingOn.object === "token" ?
                                                            "Comment on this NFT" :
                                                            "Reply to " + commenter + "'s comment"
                                                    }
                                                    name="comment"
                                                    id="hodl-comments-add"
                                                    type="text"
                                                />
                                                <BackspaceOutlined
                                                    sx={{ cursor: 'pointer', position: 'absolute', right: 8, top: 8, color: '#999' }}
                                                    fontSize="inherit"
                                                    onClick={() => {
                                                        setCommentingOn({
                                                            object: "token",
                                                            objectId: nft.tokenId,
                                                            mutateList: swr.mutate,
                                                            mutateCount: mutateCount
                                                        });
                                                        router?.query?.comment = null;
                                                    }
                                                    } />
                                            </Box>
                                        </Tooltip>
                                        <Typography sx={{ textAlign: 'right', fontSize: 10, paddingLeft: 0.75 }}>{values?.comment?.length} / 150</Typography>
                                    </Box>
                                </Form>
                            </>)}
                    </Formik>}
                </CardContent>
            </Card>
        </>
    )
}