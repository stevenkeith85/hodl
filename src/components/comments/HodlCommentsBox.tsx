import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { NftContext } from "../../contexts/NftContext";
import { useComments } from "../../hooks/useComments";
import { useCommentCount } from "../../hooks/useCommentCount";
import { getAsString } from "../../lib/getAsString";


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

interface HodlCommentsBoxProps {
    limit: number;
    minHeight?: string;
    maxHeight?: string;
    fallbackData?: any;
}

export const HodlCommentsBox: React.FC<HodlCommentsBoxProps> = ({
    limit,
    minHeight = '200px',
    maxHeight = '500px',
    fallbackData = null
}) => {
    const { nft } = useContext(NftContext);
    const router = useRouter();
    
    const [topLevel, setTopLevel] = useState<{
        objectId: number,
        object: "token" | "comment"
    }>({
        objectId: +getAsString(router.query.comment) || nft.id,
        object: router?.query?.comment ? "comment" : "token"
    })

    // We remember the previous top levels as well, so that we can do 'back'
    const [oldTopLevel, setOldTopLevel] = useState([])

    const newTagRef = useRef();
    const [loading, setLoading] = useState(false);

    const swr = useComments(topLevel.objectId, limit, topLevel.object, fallbackData, true, (topLevel.object === "token"));
    const countSWR = useCommentCount(topLevel.objectId, topLevel.object, null);
    
    // TODO: We should maybe just store a Token | HodlComment 
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
    }, [topLevel.object, topLevel.objectId, swr.mutate, countSWR.mutate]);

    useEffect(() => {
        if (router.query.comment) {
            setTopLevel({
                objectId: +getAsString(router.query.comment),
                object: "comment"
            })
        }
    }, [router.query.comment])

    return (<>
        { 
            Boolean(oldTopLevel.length) && <HodlCommentsBoxHeader
            setTopLevel={setTopLevel}
            oldTopLevel={oldTopLevel}
            setOldTopLevel={setOldTopLevel}
        />
        }
        <HodlCommentsBoxBody
            swr={swr}
            countSWR={countSWR}
            loading={loading}
            minHeight={minHeight}
            maxHeight={maxHeight}
            limit={limit}
            setCommentingOn={setCommentingOn} // TODO: Looks like its really this that we'd want to put in a context - as its just passed through intermediate components
            topLevel={topLevel}
            setTopLevel={setTopLevel}
            setOldTopLevel={setOldTopLevel}
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