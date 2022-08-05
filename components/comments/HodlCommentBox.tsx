import { Typography, Box, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import { Likes } from "../Likes";
import { HighlightOffOutlined, Message, Reply } from "@mui/icons-material";
import { useComments, useCommentCount, useDeleteComment } from "../../hooks/useComments";
import { FC, useContext, useState } from "react";
import { HodlCommentViewModel } from "../../models/HodlComment";
import { WalletContext } from "../../contexts/WalletContext";
import { formatDistanceStrict } from "date-fns";
import { ProfileNameOrAddress } from "../avatar/ProfileNameOrAddress";
import { UserAvatarAndHandle } from "../avatar/UserAvatarAndHandle";
import { NftContext } from "../../contexts/NftContext";
import { useLikeCount } from "../../hooks/useLikeCount";


export const Replies = ({
    countSWR,
    showThread,
    setShowThread,
    swr,
    setCommentingOn,
    addCommentInput,
    setTopLevel,
    mutateCount,
    parentColor
}) => {

    const colors: ("primary" | "secondary")[] = ["primary", "secondary"];
    const firstIndex = colors.indexOf(parentColor) + 1

    return (<>
        {
            Boolean(countSWR.data) &&
            <Box
                display="flex"
                flexDirection="column"
                gap={1}
                sx={{
                    width: '100%'
                }}
            >
                {
                    (<>
                        {
                            showThread && swr?.data?.map(({ items, next, total }) => (<>
                                <Box key={next} display="flex" flexDirection="column" gap={1.5}> {
                                    (items || []).map(
                                        (comment: HodlCommentViewModel, i: number) => (<HodlCommentBox
                                            key={`hodl-comments-${comment.id}`}
                                            comment={comment}
                                            color={colors[(firstIndex + i) % 2]}
                                            setCommentingOn={setCommentingOn}
                                            addCommentInput={addCommentInput}
                                            parentMutateList={swr.mutate}
                                            parentMutateCount={countSWR.mutate}
                                            setTopLevel={setTopLevel}
                                            mutateCount={mutateCount}
                                        />)
                                    )
                                }</Box>
                            </>
                            )
                            )
                        }
                        {
                            swr.data &&
                            swr.data.length &&
                            swr.data[swr.data.length - 1].next !== swr.data[swr.data.length - 1].total &&
                            <Typography
                                sx={{
                                    fontSize: 10,
                                    color: "#999",
                                    cursor: 'pointer',
                                    marginY: 1,
                                    marginLeft: '20px'
                                }}
                                onClick={() => swr.setSize(old => old + 1)}
                            >
                                more replies ...
                            </Typography>}
                    </>
                    )
                }
            </Box>
        }
    </>)
}

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
}) => {

    const router = useRouter();

    const { address } = useContext(WalletContext);
    const { nft } = useContext(NftContext);

    const {swr: likesCount} = useLikeCount(comment.id, "comment");

    const [deleteComment] = useDeleteComment();
    const [showThread, setShowThread] = useState(shouldShowThread);

    // SWRs

    // If we have a top level COMMENT, then we'll use the SWR passed in (as we need to use EXACTLY the same bound mutate function for things to work)
    // If we have a top level NFT, then we'll use the internal SWRs here to get the replies, and reply count for the comment

    // we can't conditionally call react hooks. hence the double assignment
    const internalSWR = useComments(comment.id, 10, "comment", null, showThread);
    const swr = replySWR || internalSWR;

    // we can't conditionally call react hooks. hence the double assignment
    const internalCountSWR = useCommentCount(comment.id, "comment", null);
    const countSWR = replyCountSWR || internalCountSWR;

    const canDeleteComment = (comment: HodlCommentViewModel) => comment.user.address === address || nft?.owner === address;

    return (
        <Box display="flex" flexDirection="column" gap={1}
        >
            <Box
                display="flex"
                flexDirection="column"
                gap={0.5}
                sx={{
                    paddingY: 1,
                    width: `100%`
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
                        size="35px"
                        handle={false}
                    />
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="start"
                        gap={1}
                        sx={{
                            // background: 'orange',
                            width: `100%`
                        }}
                    >
                        <Box

                            sx={{
                                // background: 'blue',
                                display: 'flex',
                                width: `100%`,
                                justifyContent: 'space-between'
                            }}>
                            <Box
                                display="flex"
                                flexDirection="column"
                                flexWrap="wrap"
                                gap={1}
                            >
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    flexWrap="wrap"
                                    gap={1}
                                >
                                    <Box sx={{
                                        display: 'flex',
                                        gap: 1,
                                        alignItems: 'center',
                                        // background: 'yellow'
                                    }}>
                                        <ProfileNameOrAddress
                                            profileAddress={comment.user.address}
                                            fallbackData={comment.user}
                                            color={color}
                                            // fontSize="12px"
                                        />
                                        <Typography
                                            sx={{
                                                // fontSize: "12px",
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
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ whiteSpace: 'pre-line' }}>{comment.comment}</Typography>
                                </Box>
                                <Box 
                                    display="flex" 
                                    gap={1} 
                                    // sx={{ background: 'orange'}}
                                >

                                    {countSWR.data && showThread && !swr.error && !swr.data ?
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
                                                color: countSWR.data ? theme => theme.palette.secondary.dark: theme => theme.palette.text.secondary,
                                                cursor: countSWR.data ? 'pointer': 'unset',
                                                '&:hover': {
                                                    color: countSWR.data ? theme => theme.palette.text.primary: theme => theme.palette.text.secondary
                                                }
                                            }}
                                            onClick={() => setShowThread(old => !old)}
                                        >
                                            { countSWR.data !== 1 ?`${countSWR.data} replies`: `1 reply` }
                                        </Typography>
                                    }
                                    <Typography
                                        sx={{
                                            fontSize: "12px",
                                            color: theme => theme.palette.text.secondary
                                        }}>
                                        {likesCount?.data} likes
                                    </Typography>
                                </Box>
                            </Box>
                            <Box display="flex" alignItems="start" gap={1}>
                                {address &&
                                    <Likes
                                        color="inherit"
                                        sx={{
                                            cursor: 'pointer',
                                            color: '#999',
                                            '&:hover': {
                                                color: '#333',
                                            }
                                        }}
                                        fontSize="14px"
                                        id={comment.id}
                                        object="comment"
                                        showCount={false}
                                        likeTooltip={'Like this Comment'}
                                        unlikeTooltip={'Stop liking this Comment'}
                                    />
                                }
                                {address &&
                                    <Tooltip title="Reply to this Comment">
                                        <Reply
                                            sx={{
                                                cursor: 'pointer',
                                                color: '#999',
                                                '&:hover': {
                                                    color: '#333',
                                                },
                                                fontSize: "14px"
                                            }}

                                            onClick={() => {
                                                setCommentingOn({
                                                    object: "comment",
                                                    objectId: comment.id,
                                                    mutateList: swr.mutate,
                                                    mutateCount: countSWR.mutate,
                                                    setShowThread,
                                                    color
                                                })
                                                addCommentInput?.focus();
                                            }
                                            } />
                                    </Tooltip>
                                }
                                {Boolean(countSWR.data) && <Tooltip title="View Single Comment Thread">
                                    <Message
                                        sx={{
                                            cursor: 'pointer',
                                            color: theme => theme.palette.text.secondary,
                                            '&:hover': {
                                                color: theme => theme.palette.text.primary,
                                            },
                                            fontSize: "14px"
                                        }}
                                        fontSize="inherit"
                                        onClick={() => {
                                            setTopLevel({ objectId: comment.id, object: "comment" });
                                            router.push({
                                                pathname: window.location.pathname,
                                                query: { comment: comment.id }
                                            }, undefined, { shallow: true });
                                        }}
                                    />
                                </Tooltip>
                                }
                                {
                                    address && canDeleteComment(comment) &&
                                    <Tooltip title="Delete this Comment">
                                        <HighlightOffOutlined
                                            sx={{
                                                cursor: 'pointer',
                                                color: '#999',
                                                '&:hover': {
                                                    color: '#333',
                                                },
                                                fontSize: "14px"
                                            }}
                                            fontSize="inherit"
                                            onClick={async () => {
                                                await deleteComment(comment);
                                                parentMutateList();
                                                parentMutateCount();
                                                mutateCount();
                                            }
                                            }
                                        />
                                    </Tooltip>
                                }
                            </Box>
                        </Box>
                        <Replies
                            countSWR={countSWR}
                            showThread={showThread}
                            setShowThread={setShowThread}
                            swr={swr}
                            setCommentingOn={setCommentingOn}
                            addCommentInput={addCommentInput}
                            setTopLevel={setTopLevel}
                            mutateCount={mutateCount}
                            parentColor={color}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
