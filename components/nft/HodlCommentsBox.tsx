import { Card, CardContent, Typography, Box, Badge, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useCommentCount, useComments } from "../../hooks/useComments";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import { AddComment } from "./AddComment";
import { InfiniteScrollComments } from "../profile/InfiniteScrollComments";
import { HodlCommentBox } from "../HodlCommentBox";
import { fetchWithId } from "../../lib/swrFetchers";
import useSWR from "swr";
import { Forum } from "@mui/icons-material";


interface HodlCommentsBoxProps {
    tokenId: number, // the nft these comments are about. Each comment will store a reference to this to allow us to check who can delete comments. (i.e. the user or token owner)
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
    tokenId,
    objectId,
    object = "token",
    prefetchedComments, // TODO - NEEDS UPDATED
    prefetchedCommentCount, // TODO - NEEDS UPDATED
    limit,
    maxHeight = '500px',
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
        setShowThread: Function,
        color: "primary" | "secondary"
    }>({
        object,
        objectId,
        mutateList: swr.mutate,
        mutateCount: countSWR.mutate,
        setShowThread: () => null,
        color: "primary"
    });

    useEffect(() => {
        setCommentingOn({
            object,
            objectId: Number(objectId),
            mutateList: swr.mutate,
            mutateCount: countSWR.mutate,
            setShowThread: () => null,
            color: "primary"
        })
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
                                <Tooltip title="View All Comments">
                                    <Forum
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
                                </Tooltip>
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
                                    mutateCount={countSWR.mutate}
                                /> </Box> :
                            comment && <HodlCommentBox
                                color="primary"
                                shouldShowThread={true}
                                comment={comment}
                                setCommentingOn={setCommentingOn}
                                parentMutateList={() => null}
                                parentMutateCount={() => null}
                                addCommentInput={newTagRef.current}
                                replySWR={swr}
                                replyCountSWR={countSWR}
                                setTopLevel={setTopLevel}
                                mutateCount={countSWR.mutate}
                            />
                        }
                    </Box>
                    <AddComment
                        tokenId={tokenId}
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