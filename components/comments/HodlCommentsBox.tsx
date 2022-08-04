import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { object } from "yup";
import { NftContext } from "../../contexts/NftContext";
import { useCommentCount, useComments } from "../../hooks/useComments";
import { getAsString } from "../../lib/utils";
import { AddComment } from "../nft/AddComment";
import { HodlCommentsBoxBody } from "./HodlCommentsBoxBody";
import { HodlCommentsBoxHeader } from "./HodlCommentsBoxHeader";


interface HodlCommentsBoxProps {
    limit: number,
    minHeight?: string,
    maxHeight?: string,
}

export const HodlCommentsBox: React.FC<HodlCommentsBoxProps> = ({
    limit,
    minHeight = '200px',
    maxHeight = '500px',
}) => {
    const { nft } = useContext(NftContext);
    const router = useRouter();

    const [topLevel, setTopLevel] = useState<{
        objectId: number,
        object: "token" | "comment"
    }>({
        objectId: getAsString(router.query.comment) || nft.id,
        object: router.query.comment ? "comment" : "token"
    })

    const newTagRef = useRef();
    const [loading, setLoading] = useState(false);

    const swr = useComments(topLevel.objectId, 10, topLevel.object, null);
    const countSWR = useCommentCount(topLevel.objectId, topLevel.object, null);
    
    const [commentingOn, setCommentingOn] = useState<{
        object: "token" | "comment",
        objectId: number,
        mutateList: Function,
        mutateCount: Function,
        setShowThread: Function,
        color: "primary" | "secondary"
    }>({
        object: "token", // we are initially commenting on the nft. this can be set to a comment by the user though
        objectId: nft.id,
        mutateList: swr.mutate,
        mutateCount: countSWR.mutate,
        setShowThread: () => null,
        color: "primary"
    });

    useEffect(() => {
        setCommentingOn({
            object: topLevel.object,
            objectId: topLevel.objectId,
            mutateList: swr.mutate,
            mutateCount: countSWR.mutate,
            setShowThread: () => null,
            color: "primary"
        })
    }, [topLevel.object, topLevel.objectId]);

    return (<>
        <HodlCommentsBoxHeader 
            object={topLevel.object} 
            countSWR={countSWR} 
            setTopLevel={setTopLevel}
            />
        <HodlCommentsBoxBody 
            topLevelObject={topLevel.object} 
            topLevelObjectId={topLevel.objectId} 
            swr={swr}
            countSWR={countSWR} 
            loading={loading} 
            minHeight={minHeight} 
            maxHeight={maxHeight}
            limit={limit} 
            setCommentingOn={setCommentingOn} // TODO: Looks like its really this that we'd want to put in a context - as its just passed through intermediate components
            setTopLevel={setTopLevel} 
            newTagRef={newTagRef} />
        <AddComment
            object={topLevel.object}
            objectId={topLevel.objectId}
            tokenId={nft.id}
            commentingOn={commentingOn}
            setCommentingOn={setCommentingOn}
            mutateList={swr.mutate}
            mutateCount={countSWR.mutate}
            setLoading={setLoading}
            newTagRef={newTagRef}
        />
    </>
    )
}