import { Card, CardContent, Typography, Box, Tooltip, Badge } from "@mui/material";
import { useRouter } from "next/router";
import axios from 'axios';
import useSWR, { useSWRConfig } from "swr";
import { useContext, useEffect, useRef, useState } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { Formik, Form, Field } from "formik";
import { InputBase } from 'formik-mui';
import { AddCommentValidationSchema } from "../../validationSchema/comments/addComments";
import { useComments } from "../../hooks/useComments";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import { CommentThread } from "../comments/CommentThread";
import { HighlightOffOutlined } from "@mui/icons-material";

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

    const [commentingOn, setCommentingOn] = useState({
        object: "token",
        objectId: nft.tokenId
    });

    const [_tokenSwr, _tokenAddComment, _tokenDeleteComment, tokenCount] = useComments(
        nft.tokenId, 
        nft.tokenId, 
        limit, 
        setLoading, 
        "token", 
        prefetchedComments, 
        prefetchedCommentCount);

    const [_swr, addComment,] = useComments(
        nft.tokenId,
        commentingOn.objectId, 
        limit, 
        setLoading, 
        commentingOn.object, 
        prefetchedComments, 
        prefetchedCommentCount
    );


    useEffect(() => {
        if (router.query.comment) {
            setTimeout(() => {
                document.querySelector(`#hodl-comments-${router.query.comment}`)?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
            }, 300)
        }
    }, [router.query.comment]);

    useEffect(() => {
        setTimeout(() => {
            // @ts-ignore
            newTagRef?.current?.focus();
        })
    }, [commentingOn.objectId])

    return (
        <>
            <Card variant="outlined">
                <CardContent>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="h3" sx={{ marginBottom: 2 }}>Comments <Badge sx={{ p: '6px 3px' }} showZero badgeContent={tokenCount} max={1000}></Badge></Typography>
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
                            setLoading={setLoading} 
                            token={true} 
                            limit={limit} 
                            setCommentingOn={setCommentingOn} 
                            prefetchedComments={prefetchedComments}
                            prefetchedCommentCount={prefetchedCommentCount}
                        />
                    </Box>
                    {address && <Formik
                        initialValues={{
                            comment: '',
                            id: commentingOn.objectId
                        }}
                        validationSchema={AddCommentValidationSchema}
                        onSubmit={async (values) => {
                            await addComment(values.comment, commentingOn.object);
                            values.comment = '';
                            setTimeout(() => {
                                // @ts-ignore
                                newTagRef?.current?.focus();
                            })
                        }}
                    >
                        {({ errors, values }) => (
                            <>
                                {/* {JSON.stringify(errors)} */}
                                <Form>
                                    <Box display="flex" alignItems="center" marginTop={2}>
                                        <Tooltip title={errors?.comment || ''} >
                                            <Box display="flex" position="relative" flexGrow={1}>
                                                <Field
                                                    validateOnChange
                                                    autoComplete='off'
                                                    inputRef={newTagRef}
                                                    component={InputBase}
                                                    sx={{ flexGrow: 1, border: errors.comment ? theme => `1px solid ${theme.palette.error.main}` : `1px solid #ccc`, borderRadius: 1, paddingX: 1.5 }}
                                                    placeholder={commentingOn.object ? "comment on token " + commentingOn.objectId : "replying to comment " + commentingOn.objectId}
                                                    name="comment"
                                                    id="hodl-comments-add"
                                                    type="text"
                                                />
                                                <HighlightOffOutlined
                                                    sx={{ cursor: 'pointer', position: 'absolute', right: 8, top: 8, color: '#999' }}
                                                    fontSize="inherit"
                                                    onClick={() => setCommentingOn({
                                                        object: "token",
                                                        objectId: nft.tokenId
                                                    })} />
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