import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography";

import { HodlLoadingSpinner } from "../HodlLoadingSpinner";

import { InfiniteScrollComments } from "../profile/InfiniteScrollComments";
import { fetchWithId } from "../../lib/swrFetchers";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { useContext } from "react";
import { CommentsContext } from "../../contexts/CommentsContext";


const HodlCommentBox = dynamic(
    () => import("./HodlCommentBox").then(mod => mod.HodlCommentBox),
    {
        ssr: false,
        loading: () => null
    }
);

export const HodlCommentsBoxBody = ({
    loading,
    height,
    swr,
    limit,
    newTagRef,
}) => {
    // When there's a top level comment we want to display that first, and then all its replies
    // if we just use the top level swr we would only have the replies
    const { topLevel } = useContext(CommentsContext);
    const { data: comment } = useSWR(
        topLevel &&
            topLevel.object === "comment" &&
            topLevel.objectId ? [`/api/comment`, topLevel?.objectId] : null,
        fetchWithId
    );

    return (
        <Box
            sx={{
                height,
                overflowY: 'auto',
                overflowX: 'hidden',
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
                        margin: 0,
                    }} />
            }
            {
                topLevel?.object === "token" ?
                    <div>
                        <InfiniteScrollComments
                            swr={swr}
                            limit={limit}
                            addCommentInput={newTagRef?.current}
                        />
                        {
                            swr?.data &&
                            swr?.data[0]?.items?.length === 0 &&
                            <Typography>No comments</Typography>
                        }
                    </div> :
                    comment && <HodlCommentBox
                        addCommentInput={newTagRef.current}
                        color="primary"
                        shouldShowThread={true}
                        comment={comment}
                        parentMutateList={() => null}
                        replySWR={swr}
                    />
            }
        </Box>
    );
}