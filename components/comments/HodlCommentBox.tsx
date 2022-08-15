import { Typography, Box, Tooltip, IconButton, Menu, MenuList, MenuItem, ListItemIcon, ListItemText, Paper } from "@mui/material";
import { useRouter } from "next/router";
import { Likes } from "../Likes";
import { DeleteForeverOutlined, DeleteOutlined, DeleteOutlineSharp, HighlightOffOutlined, Message, Reply } from "@mui/icons-material";
import { useComments, useCommentCount, useDeleteComment } from "../../hooks/useComments";
import React, { FC, useContext, useState } from "react";
import { HodlCommentViewModel } from "../../models/HodlComment";
import { WalletContext } from "../../contexts/WalletContext";
import { formatDistanceStrict } from "date-fns";
import { ProfileNameOrAddress } from "../avatar/ProfileNameOrAddress";
import { UserAvatarAndHandle } from "../avatar/UserAvatarAndHandle";
import { NftContext } from "../../contexts/NftContext";
import { useLikeCount } from "../../hooks/useLikeCount";
import { pluralize } from "../../lib/utils";
import { SWRInfiniteResponse } from "swr/infinite/dist/infinite";
import { SWRResponse } from "swr";
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface HodlCommentActionButtonsProps {
    comment: HodlCommentViewModel;
    setCommentingOn: Function;
    swr: SWRInfiniteResponse;
    countSWR: SWRResponse;
    setShowThread: Function;
    color: "primary" | "secondary"
    addCommentInput: any;
    parentMutateList: Function;
    parentMutateCount: Function;
    mutateCount: Function;
}

export const HodlCommentActionButtons: React.FC<HodlCommentActionButtonsProps> = ({
    comment,
    setCommentingOn,
    swr,
    countSWR,
    setShowThread,
    color,
    addCommentInput,
    parentMutateList,
    parentMutateCount,
    mutateCount,
}) => {

    const { address } = useContext(WalletContext);
    const { nft } = useContext(NftContext);

    const canDeleteComment = (comment: HodlCommentViewModel) => comment.user.address === address || nft?.owner === address;
    const [deleteComment] = useDeleteComment();

    // Comment Menu
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (<Box display="flex" alignItems="start" gap={1.5} marginX={1}>
        {address &&
            <Tooltip title="reply">
                <Reply
                    sx={{
                        cursor: 'pointer',
                        color: theme => theme.palette.text.secondary,
                        '&:hover': {
                            color: theme => theme.palette.text.primary,
                        },
                        fontSize: `14px`
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
        {address &&
            <Likes
                color="inherit"
                sx={{
                    cursor: 'pointer',
                    color: theme => theme.palette.text.secondary,
                    '&:hover': {
                        color: theme => theme.palette.text.primary,
                    }
                }}
                fontSize="14px"
                id={comment.id}
                object="comment"
                showCount={false}
            />
        }
        {
            address && canDeleteComment(comment) && (<>
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{
                        padding: 0
                    }}
                >
                    <MoreVertIcon
                        sx={{
                            cursor: 'pointer',
                            color: theme => theme.palette.text.secondary,
                            '&:hover': {
                                color: theme => theme.palette.text.primary,
                            },
                            fontSize: `14px`
                        }}
                    />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}

                >

                    <MenuList
                        dense
                        sx={{
                            padding: 0
                        }}
                    >
                        <MenuItem
                            onClick={async () => {
                                await deleteComment(comment);
                                parentMutateList();
                                parentMutateCount();
                                mutateCount();
                            }
                            }>
                            <ListItemIcon
                                sx={{
                                    '&.MuiListItemIcon-root': { 
                                        minWidth: 0,
                                        marginRight: `8px`
                                    }
                                }}>
                                <DeleteOutlineSharp sx={{ fontSize: '14px' }} />
                            </ListItemIcon>
                            <ListItemText>delete</ListItemText>
                        </MenuItem>
                    </MenuList>
                </Menu>
            </>)
        }
    </Box>)
}

export const Replies = ({
    countSWR,
    showThread,
    swr,
    setCommentingOn,
    addCommentInput,
    setTopLevel,
    mutateCount,
    parentColor,
    level
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
                                <Box key={next} display="flex" flexDirection="column" gap={2}> {
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
                                            level={level + 1}
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

    const { swr: likesCount } = useLikeCount(comment.id, "comment");

    // if we are on the first level, we'll show the replies. Bit nicer for the user
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

    return (
        <Box
            display="flex"
            flexDirection="column"
            // gap={1}
            width={`100%`}
        >
            <Box
                display="flex"
                flexDirection="column"
                // gap={0.5}
                sx={{
                    paddingLeft: 0,
                    width: `100%`
                }}
            >
                <Box
                    display="flex"
                    alignItems="start"
                    gap={1.5}
                    sx={{
                        // background: 'green',
                        width: `100%`
                    }}
                    id={`hodl-comments-${comment.id}`}>
                    <UserAvatarAndHandle
                        address={comment.user.address}
                        fallbackData={comment.user}
                        size={35}
                        handle={false}
                    />
                    <Box
                        display="flex"
                        flexDirection="column"
                        // alignItems="start"
                        gap={2}
                        sx={{
                            // background: 'orange',
                            width: `100%`
                        }}
                    >
                        <Box
                            sx={{
                                // background: 'lightblue',
                                display: 'flex',
                                width: `100%`,
                                // justifyContent: 'space-between',
                                // paddingRight: 1
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
                                    // gap={1}
                                >
                                    <Box sx={{
                                        display: 'flex',
                                        // gap: 1,
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
                                            // fontSize="12px"
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
                                    <Typography sx={{ whiteSpace: 'pre-line', marginY: 0.25 }}>{comment.comment}</Typography>
                                </Box>
                                <Box
                                    display="flex"
                                    gap={1}
                                // sx={{ background: 'orange' }}
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
                                                    cursor: countSWR.data ? 'pointer' : 'unset',
                                                    '&:hover': {
                                                        color: countSWR.data ? theme => theme.palette.text.primary : theme => theme.palette.text.secondary
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
