import { Typography, Box } from "@mui/material";
import { useRouter } from "next/router";
import { useComments, useCommentCount } from "../../hooks/useComments";
import React, { FC, useContext, useEffect, useState } from "react";
import { HodlComment, HodlCommentViewModel } from "../../models/HodlComment";
import { formatDistanceStrict } from "date-fns";
import { ProfileNameOrAddress } from "../avatar/ProfileNameOrAddress";
import { UserAvatarAndHandle } from "../avatar/UserAvatarAndHandle";
import { useLikeCount } from "../../hooks/useLikeCount";
import { pluralize } from "../../lib/utils";
import { PusherContext } from "../../contexts/PusherContext";
import { HodlCommentActionButtons } from "./HodlCommentActionButtons";
import { Replies } from "./Replies";


interface HodlCommentBoxProps {
    comment: HodlCommentViewModel;
    color?: "primary" | "secondary";
    setCommentingOn: Function;

    parentMutateList: Function;
    parentMutateCount: Function;

    addCommentInput: any;

    // we need to pass in the swr's for a single comment thread
    replyCountSWR?: any;
    replySWR?: any;

    shouldShowThread?: boolean;
    setTopLevel?: any | null;
    mutateCount?: any | null;

    level?: number; // tells us how deep we are in the thread. we only show the 'view single comment thread' thing when they are a few levels in
}

export const HodlCommentBox: FC<HodlCommentBoxProps> = ({
    comment,
    color = "secondary",
    setCommentingOn,
    parentMutateList,
    parentMutateCount,
    addCommentInput,
    replyCountSWR = null,
    replySWR = null,
    shouldShowThread = false,
    setTopLevel = null,
    mutateCount = null,
    level = 0
}) => {
    const { pusher } = useContext(PusherContext);

    const { swr: likesCount } = useLikeCount(comment.id, "comment");

    const [showThread, setShowThread] = useState(shouldShowThread || level < 1);

    // SWRs

    // If we have a top level COMMENT, then we'll use the SWR passed in (as we need to use EXACTLY the same bound mutate function for things to work)
    // If we have a top level NFT, then we'll use the internal SWRs here to get the replies, and reply count for the comment

    // we can't conditionally call react hooks. hence the double assignment
    const internalSWR = useComments(comment.id, 10, "comment", null, showThread);
    const swr = replySWR || internalSWR;

    // we can't conditionally call react hooks. hence the double assignment
    const internalCountSWR = useCommentCount(comment.id, "comment", null);
    const countSWR = replyCountSWR || internalCountSWR;

    const router = useRouter();

    useEffect(() => {
        if (!pusher) {
            return;
        }

        const channel = pusher.subscribe("comments");
        channel.bind("reply", (repliedTo: HodlComment) => {
            if (comment.id === repliedTo.id) {
                setShowThread(true);
                swr.mutate()
                countSWR.mutate()
            }
        });

        return () => {

        }

    }, [pusher])

    return (
        <Box
            display="flex"
            flexDirection="column"
            sx={{
                // width: `100%`,
                marginLeft: '20px',
                borderLeft: '2px dashed #eee',

                // '&:last-of-type': {
                //     border: '2px solid transparent'
                // }
            }}
        >
            <Box
                display="flex"
                flexDirection="column"
                // gap={0.5}
                sx={{
                    // paddingLeft: 0,
                    width: `calc(100% + 20px)`,
                    marginLeft: '-20px',
                    paddingBottom: 3,
                    // background: 'yellow',
                    // border: '1px solid red'
                }}
            >
                <Box
                    display="flex"
                    alignItems="start"
                    gap={2}
                    sx={{
                        // background: 'green',
                        width: `100%`
                    }}
                    id={`hodl-comments-${comment.id}`}>
                    <UserAvatarAndHandle
                        address={comment.user.address}
                        fallbackData={comment.user}
                        size={40}
                        handle={false}
                    />
                    <Box
                        display="flex"
                        flexDirection="column"
                        // alignItems="start"
                        // gap={2}
                        sx={{
                            // background: 'orange',
                            width: `100%`,
                        }}
                    >
                        <Box
                            sx={{
                                // background: 'lightblue',
                                display: 'flex',
                                width: `100%`,
                            }}>
                            <Box
                                display="flex"
                                flexDirection="column"
                                flexWrap="wrap"
                                // gap={0.5}
                                width={`100%`}
                            >
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    flexWrap="wrap"
                                >
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        // background: 'yellow',
                                        justifyContent: 'space-between',
                                        width: `100%`
                                    }}>
                                        <Box display="flex" sx={{
                                            gap: 1,
                                            alignItems: 'center',
                                        }}>
                                            <ProfileNameOrAddress
                                                profileAddress={comment.user.address}
                                                fallbackData={comment.user}
                                                color={color}
                                            />
                                            <Typography
                                                sx={{
                                                    fontWeight: 600,
                                                    color: theme => theme.palette.text.secondary
                                                }}>
                                                ·
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: "12px",
                                                    color: theme => theme.palette.text.secondary
                                                }}>
                                                {comment.timestamp && formatDistanceStrict(new Date(comment.timestamp), new Date(), { addSuffix: false })}
                                            </Typography></Box>
                                        <HodlCommentActionButtons
                                            comment={comment}
                                            setCommentingOn={setCommentingOn}
                                            swr={swr}
                                            countSWR={countSWR}
                                            setShowThread={setShowThread}
                                            color={color}
                                            addCommentInput={addCommentInput}
                                            parentMutateList={parentMutateList}
                                            parentMutateCount={parentMutateCount}
                                            mutateCount={mutateCount}
                                        />

                                    </Box>
                                    <Typography sx={{ whiteSpace: 'pre-line', marginY: 1 }}>{comment.comment}</Typography>
                                </Box>
                                <Box
                                    display="flex"
                                    gap={1}
                                //    sx={{ background: 'orange' }}
                                >
                                    {
                                        countSWR.data && showThread && !swr.error && !swr.data ?
                                            <Typography
                                                sx={{
                                                    fontSize: "12px",
                                                    color: theme => theme.palette.text.secondary,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                loading
                                            </Typography> :
                                            <Typography
                                                sx={{
                                                    fontSize: "12px",
                                                    color: theme => theme.palette.text.secondary,
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        color: theme => theme.palette.text.primary
                                                    }
                                                }}
                                                onClick={() => {
                                                    if (level < 4) {
                                                        setShowThread(old => !old);
                                                    } else {
                                                        setTopLevel({ objectId: comment.id, object: "comment" });
                                                        router.push({
                                                            pathname: window.location.pathname,
                                                            query: { comment: comment.id }
                                                        }, undefined, { shallow: true });
                                                    }

                                                }}
                                            >
                                                {level < 4 ? pluralize(countSWR.data, 'reply') : 'view thread'}
                                            </Typography>
                                    }
                                    <Typography
                                        sx={{
                                            fontSize: "12px",
                                            color: theme => theme.palette.text.secondary
                                        }}>
                                        {pluralize(likesCount?.data, 'like')}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Replies
                            countSWR={countSWR}
                            showThread={showThread}
                            swr={swr}
                            setCommentingOn={setCommentingOn}
                            addCommentInput={addCommentInput}
                            setTopLevel={setTopLevel}
                            mutateCount={mutateCount}
                            parentColor={color}
                            level={level}
                        />
                    </Box>
                </Box>
            </Box>
        </Box >
    );
};
