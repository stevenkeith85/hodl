import { Typography, Box } from "@mui/material";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import { InfiniteScrollComments } from "../profile/InfiniteScrollComments";
import { HodlCommentBox } from "./HodlCommentBox";
import { fetchWithId } from "../../lib/swrFetchers";
import useSWR from "swr";


export const HodlCommentsBoxBody = ({
    loading,
    minHeight,
    maxHeight,
    swr,
    countSWR,
    limit,
    setCommentingOn,
    topLevel,
    setTopLevel,
    setOldTopLevel,
    newTagRef,
}) => {
    const { data: comment } = useSWR(
        topLevel && topLevel.object === "comment" && topLevel.objectId ? [`/api/comment`, topLevel?.objectId] : null,
        fetchWithId
    );

    return (
        <Box
            sx={{
                maxHeight,
                minHeight,
                overflow: 'auto',
                position: 'relative',
            }}
        >
            {
                loading && <HodlLoadingSpinner
                    sx={{
                        position: 'absolute',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                    }} />

            }
            {topLevel?.object === "token" ?
                <div>
                    <InfiniteScrollComments
                        swr={swr}
                        limit={limit}
                        setCommentingOn={setCommentingOn}
                        addCommentInput={newTagRef?.current}
                        parentMutateCount={countSWR.mutate}
                        topLevel={topLevel}
                        setTopLevel={setTopLevel}
                        setOldTopLevel={setOldTopLevel}
                        mutateCount={countSWR.mutate}
                    />
                    {swr?.data && swr?.data[0]?.items?.length === 0 && <Typography>No comments</Typography>}
                </div> :
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
                    topLevel={topLevel}
                    setTopLevel={setTopLevel}
                    setOldTopLevel={setOldTopLevel}
                    mutateCount={countSWR.mutate}
                />
            }
        </Box>
    );
}