import { Card, CardContent, Typography, Box, Badge } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useCommentCount, useComments } from "../../hooks/useComments";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import { AddComment } from "./AddComment";
import { InfiniteScrollComments } from "../profile/InfiniteScrollComments";
import { HodlCommentBox } from "../HodlCommentBox";
import { fetchWithId } from "../../lib/swrFetchers";
import useSWR from "swr";
import { HighlightOffOutlined } from "@mui/icons-material";


interface HodlCommentsBoxProps {
    objectId: number, // the base object the main comment thread is about
    object: "token" | "comment", // the base object type the main comment thread is about
    prefetchedComments: any,
    prefetchedCommentCount: number,
    limit: number,
    maxHeight?: string,
    setTopLevel?: any | null,
    clearTopLevel?: any | null
}

export const HodlCommentsBox: React.FC<HodlCommentsBoxProps> = ({
    objectId,
    object = "token",
    prefetchedComments, // TODO - NEEDS UPDATED
    prefetchedCommentCount, // TODO - NEEDS UPDATED
    limit,
    maxHeight = '350px',
    setTopLevel = null,
    clearTopLevel = null,
}) => {
    const router = useRouter();
    const newTagRef = useRef();
    const [loading, setLoading] = useState(false);

    const { data: comment } = useSWR(
        object === "comment" && objectId ? [`/api/comment`, objectId] : null,
        fetchWithId,
        {
            revalidateOnMount: true
        }
    );

    const swr = useComments(objectId, 10, object, null);

    const countSWR = useCommentCount(objectId, object, null);

    const [commentingOn, setCommentingOn] = useState<{
        object: "token" | "comment",
        objectId: number,
        mutateList: Function,
        mutateCount: Function,
        setShowThread: Function
    }>({
        object,
        objectId,
        mutateList: swr.mutate,
        mutateCount: countSWR.mutate,
        setShowThread: () => null
    });

    useEffect(() => {
        setCommentingOn({
            object,
            objectId: Number(objectId),
            mutateList: swr.mutate,
            mutateCount: countSWR.mutate,
            setShowThread: () => null
        })
        setTimeout(() => {
            // @ts-ignore
            newTagRef?.current?.focus();
        });
    }, [object, objectId]);

    return (
        <>
            <Card variant="outlined">

                <CardContent>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                    >
                        {object === "token" ?
                            <Typography
                                variant="h3"
                                sx={{ marginBottom: 2 }}
                            >
                                Comments <Badge sx={{ p: '6px 3px' }} showZero badgeContent={countSWR.data} max={1000}></Badge>
                            </Typography> :
                            (<><Typography
                                variant="h3"
                                sx={{ marginBottom: 2 }}
                            >
                                Single Comment Thread
                            </Typography>
                                <HighlightOffOutlined
                                    sx={{ cursor: 'pointer', color: '#999' }}
                                    fontSize="inherit"
                                    onClick={() => {
                                        // TODO:
                                        // router.push({
                                        //     pathname: router.pathname,
                                        //     query: { tokenId: comment.tokenId }
                                        // });   
                                        if (clearTopLevel) {
                                            clearTopLevel();
                                        } else {
                                            router.push(window.location.pathname);
                                        }

                                    }} />
                            </>)
                        }
                    </Box>
                    <Box
                        sx={{
                            maxHeight,
                            minHeight: maxHeight,
                            overflow: 'auto',
                            position: 'relative',
                        }}
                    >
                        {
                            loading &&
                            <Box sx={{
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
                        {object === "token" ?
                            <Box marginRight={1}>
                                <InfiniteScrollComments
                                    swr={swr}
                                    limit={limit}
                                    setCommentingOn={setCommentingOn}
                                    addCommentInput={newTagRef?.current}
                                    parentMutateCount={countSWR.mutate}
                                    setTopLevel={setTopLevel}
                                /> </Box> :
                            comment && <HodlCommentBox
                                shouldShowThread={true}
                                comment={comment}
                                setCommentingOn={setCommentingOn}
                                parentMutateList={() => null}
                                parentMutateCount={() => null}
                                addCommentInput={newTagRef.current}
                                replySWR={swr}
                                replyCountSWR={countSWR}
                                setTopLevel={setTopLevel}
                            />
                        }
                    </Box>
                    <AddComment
                        object={object}
                        objectId={objectId}
                        commentingOn={commentingOn}
                        setCommentingOn={setCommentingOn}
                        mutateList={swr.mutate}
                        mutateCount={countSWR.mutate}
                        setLoading={setLoading}
                        newTagRef={newTagRef}
                    />
                </CardContent>
            </Card>
        </>
    )
}