import React, { FC, useContext, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles"
import Typography from "@mui/material/Typography";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import { NftContext } from "../../contexts/NftContext";
import { HodlCommentViewModel } from "../../models/HodlComment";
import { ProfileNameOrAddress } from "../avatar/ProfileNameOrAddress";
import { UserAvatarAndHandle } from "../avatar/UserAvatarAndHandle";
import { HodlCommentActionButtons } from "./HodlCommentActionButtons";
import { useComments } from "../../hooks/useComments";
import { useDeleteComment } from "../../hooks/useDeleteComment";
import { pluralize } from "../../lib/pluralize";
import { SignedInContext } from "../../contexts/SignedInContext";
import { useMutableToken } from "../../hooks/useMutableToken";
import { ExpandMoreIcon } from "../icons/ExpandMoreIcon";
import { ExpandLessIcon } from "../icons/ExpandLessIcon";
import { CommentsContext } from "../../contexts/CommentsContext";
import { canDeleteComment } from "../../lib/ui/canDeleteComment";


const Replies = dynamic(
    () => import('./Replies').then(mod => mod.Replies),
    {
        ssr: false,
        loading: () => null
    }
);

const HodlCommentPopUpMenu = dynamic(
    () => import('./HodlCommentPopUpMenu'),
    {
        ssr: false,
        loading: () => null
    }
);

interface HodlCommentBoxProps {
    comment: HodlCommentViewModel;
    color?: "primary" | "secondary";
    parentMutateList: Function;
    addCommentInput: any;
    // we need to pass in the swr's for a single comment thread
    replySWR?: any;
    shouldShowThread?: boolean;
    level?: number; // tells us how deep we are in the thread. we only show the 'view single comment thread' thing when they are a few levels in
}

export const HodlCommentBox: FC<HodlCommentBoxProps> = ({
    comment,
    color = "secondary",
    parentMutateList,
    addCommentInput,
    replySWR = null,
    shouldShowThread = false,
    level = 0
}) => {
    const { signedInAddress } = useContext(SignedInContext);
    const { nft } = useContext(NftContext);
    const { setCommentingOn, topLevel, setTopLevel, setOldTopLevel } = useContext(CommentsContext);

    // When the user tries to delete a comment, we give a visual cue
    const [isDeleting, setIsDeleting] = useState(false);

    const router = useRouter();
    const theme = useTheme();

    const { data: mutableToken } = useMutableToken(nft.id);
    const deleteComment = useDeleteComment();

    // once there's a certain depth; 
    // we rebase the comment to the root so that its easy to read. (especially on mobiles)
    const numberOfLevelsBeforeThread = 2;

    // we could do 'shouldShowThread || level < X' if we want to auto show replies. 
    // This could hammer the db though; so perhaps hold off on that until we see what its like with some users
    const [showThread, setShowThread] = useState(shouldShowThread);

    // SWRs
    // If we have a top level COMMENT, then we'll use the SWR passed in (as we need to use EXACTLY the same bound mutate function for things to work)
    // If we have a top level NFT, then we'll use the internal SWRs here to get the replies, and reply count for the comment

    // we can't conditionally call react hooks. hence the double assignment
    const internalSWR = useComments(
        comment.id,
        10,
        "comment",
        null,
        showThread
    );

    const swr = replySWR || internalSWR;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                opacity: isDeleting ? 0.4 : 1,
                marginLeft: '20px',
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    boxSizing: 'border-box',
                    width: `calc(100% + 20px)`,
                    marginLeft: '-20px',
                    marginBottom: theme.spacing(2)
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'start',
                        gap: theme.spacing(1.5),
                        width: `100%`
                    }}
                    id={`hodl-comments-${comment.id}`}
                >
                    <UserAvatarAndHandle
                        address={comment.user.address}
                        fallbackData={comment.user}
                        size={32}
                        handle={false}
                    />
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            width: `100%`,
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                width: `100%`,
                            }}>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    flexWrap: 'wrap',
                                    width: `100%`
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            width: `100%`
                                        }}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                gap: theme.spacing(1),
                                                alignItems: 'center',
                                            }}>
                                            <ProfileNameOrAddress
                                                profileAddress={comment.user.address}
                                                fallbackData={comment.user}
                                                color={color}
                                                fontSize="14px"
                                            />
                                        </div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}>
                                            {
                                                signedInAddress &&
                                                canDeleteComment(comment, signedInAddress, mutableToken) &&
                                                <HodlCommentPopUpMenu onDelete={async () => {
                                                    setIsDeleting(true);

                                                    await deleteComment(comment);
                                                    parentMutateList();

                                                    setTimeout(() => setIsDeleting(false));
                                                }} />
                                            }
                                            <HodlCommentActionButtons comment={comment} />
                                        </div>
                                    </div>
                                    <Typography
                                        sx={{
                                            whiteSpace: 'pre-line',
                                            marginTop: 0,
                                            marginBottom: 0
                                        }}
                                    >
                                        {comment.comment}
                                    </Typography>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: theme.spacing(1.5),
                                        marginTop: theme.spacing(1),
                                        marginBottom: theme.spacing(0.5)

                                    }}>
                                    <Typography
                                        sx={{
                                            color: theme => theme.palette.text.secondary,
                                            fontSize: 12
                                        }}>
                                        {
                                            comment.timestamp &&
                                            formatDistanceStrict(new Date(comment.timestamp), new Date(), { addSuffix: false })
                                        }
                                    </Typography>
                                    {signedInAddress &&
                                        <a
                                            className="text-secondary"
                                            style={{
                                                cursor: 'pointer',
                                                fontSize: 12,
                                            }}
                                            onClick={() => {
                                                console.log(comment);
                                                setCommentingOn({
                                                    object: "comment",
                                                    objectId: comment.id,
                                                    mutateList: swr.mutate,
                                                    setShowThread,
                                                    color
                                                })
                                                addCommentInput?.focus();
                                            }
                                            }>
                                            reply
                                        </a>
                                    }
                                </div>
                                {
                                    Boolean(comment.replyCount) &&
                                    <a
                                        className="text-secondary"
                                        onClick={() => {
                                            if (level < numberOfLevelsBeforeThread) {
                                                setShowThread(old => !old);
                                            } else {
                                                setOldTopLevel(old => old.concat([topLevel]));
                                                setTopLevel(({ objectId: comment.id, object: "comment" }));

                                                router.push({
                                                    pathname: window.location.pathname,
                                                    query: { comment: comment.id }
                                                }, undefined, { shallow: true });
                                            }
                                        }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: theme.spacing(0.25),
                                            cursor: 'pointer',
                                            marginTop: theme.spacing(0.5)
                                        }}
                                    >
                                        {
                                            level < numberOfLevelsBeforeThread && <>
                                                {
                                                    showThread ?
                                                        <ExpandLessIcon size={12} /> :
                                                        <ExpandMoreIcon size={12} />
                                                }
                                            </>
                                        }
                                        {
                                            Boolean(comment.replyCount) &&
                                                showThread &&
                                                swr &&
                                                !swr.error &&
                                                !swr.data ?
                                                <Typography
                                                    sx={{
                                                        fontSize: 12
                                                    }}
                                                >
                                                    loading
                                                </Typography> :
                                                <Typography
                                                    sx={{
                                                        fontSize: 12
                                                    }}
                                                >
                                                    {
                                                        level < numberOfLevelsBeforeThread ?
                                                            pluralize(comment.replyCount, 'reply')
                                                            : 'view comment thread'
                                                    }
                                                </Typography>
                                        }
                                    </a>
                                    }
                            </div>
                        </div>
                        <Replies
                            showThread={showThread}
                            swr={swr}
                            addCommentInput={addCommentInput}
                            parentColor={color}
                            level={level}
                        />
                    </div>
                </div>
            </div>
        </div >
    );
};
