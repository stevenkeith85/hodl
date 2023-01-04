import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { NftContext } from "../../contexts/NftContext";
import { useComments } from "../../hooks/useComments";
import { getAsString } from "../../lib/getAsString";
import { CommentsContext } from "../../contexts/CommentsContext";
import Box from "@mui/material/Box";
import { HodlCommentBox } from "./HodlCommentBox";


const HodlCommentsBoxBody = dynamic(
    () => import('./HodlCommentsBoxBody').then(mod => mod.HodlCommentsBoxBody),
    {
        ssr: true,
        loading: () => null
    }
);

const HodlCommentsBoxHeader = dynamic(
    () => import('./HodlCommentsBoxHeader').then(mod => mod.HodlCommentsBoxHeader),
    {
        ssr: true,
        loading: () => null
    }
);

const AddComment = dynamic(
    () => import('../nft/AddComment').then(mod => mod.AddComment),
    {
        ssr: true,
        loading: () => null
    }
);

export const HodlCommentsBox = ({
    limit,
    height = '300px',
    fallbackData = null,
}) => {
    const { nft, pinnedComment } = useContext(NftContext);
    const router = useRouter();

    const [topLevel, setTopLevel] = useState<{
        objectId: number,
        object: "token" | "comment"
    }>({
        objectId: +getAsString(router.query.comment) || nft.id,
        object: router?.query?.comment ? "comment" : "token"
    })

    const [oldTopLevel, setOldTopLevel] = useState([]);

    const swr = useComments(topLevel.objectId, limit, topLevel.object, fallbackData, true, (topLevel.object === "token"));

    const [commentingOn, setCommentingOn] = useState<{
        object: "token" | "comment",
        objectId: number,
        mutateList: Function,
        setShowThread: Function,
        color: "primary" | "secondary"
    }>(
        {
            object: "token", // we are initially commenting on the nft. this can be set to a comment by the user though
            objectId: nft.id,
            mutateList: swr.mutate,
            setShowThread: () => null,
            color: "primary"
        }
    );

    const newTagRef = useRef();
    const [loading, setLoading] = useState(false);

    const [fullscreen, setFullscreen] = useState(false);

    useEffect(() => {
        setCommentingOn({
            object: topLevel.object,
            objectId: topLevel.objectId,
            mutateList: swr.mutate,
            setShowThread: () => null,
            color: "primary"
        })
    }, [
        topLevel.object,
        topLevel.objectId,
        swr.mutate,
    ]);

    useEffect(() => {
        if (router.query.comment) {
            setTopLevel({
                objectId: +getAsString(router.query.comment),
                object: "comment"
            })
        }
    }, [router.query.comment])


    return (<>
        <CommentsContext.Provider value={{
            commentingOn,
            setCommentingOn,
            topLevel,
            setTopLevel,
            oldTopLevel,
            setOldTopLevel,
            fullscreen,
            setFullscreen,
            limit
        }}>
            <Box
                sx={{
                    position: fullscreen ? 'fixed' : 'static',
                    display: 'flex',
                    flexDirection: 'column',
                    top: 0,
                    left: 0,
                    width: fullscreen ? '100vw' : 'auto',
                    height: fullscreen ? '100%' : 'auto',
                    background: 'white',
                    zIndex: 1400
                }}
            >
                <HodlCommentsBoxHeader />
                {
                    pinnedComment && <Box
                        sx={{
                            paddingY: 1,
                            paddingX: 2,
                            position: 'relative',
                            borderBottom: `1px solid #eee`
                        }}>
                        <HodlCommentBox
                            comment={pinnedComment}
                            canReply={false}
                            parentMutateList={() => { }}
                            addCommentInput={undefined}
                        />
                    </Box>
                }
                <HodlCommentsBoxBody
                    swr={swr}
                    loading={loading}
                    height={height}
                    limit={limit}
                    newTagRef={newTagRef}
                />
                <AddComment
                    object={topLevel.object}
                    objectId={topLevel.objectId}
                    tokenId={nft.id}
                    mutateList={swr.mutate}
                    setLoading={setLoading}
                    newTagRef={newTagRef}
                />
            </Box>
        </CommentsContext.Provider>
    </>)
}