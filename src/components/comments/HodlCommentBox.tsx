import { Typography, Box, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from "@mui/material";
import { useRouter } from "next/router";
import { useComments, useCommentCount, useDeleteComment } from "../../hooks/useComments";
import React, { FC, useContext, useState } from "react";
import { HodlCommentViewModel } from "../../models/HodlComment";
import { formatDistanceStrict } from "date-fns";
import { ProfileNameOrAddress } from "../avatar/ProfileNameOrAddress";
import { UserAvatarAndHandle } from "../avatar/UserAvatarAndHandle";
import { useLikeCount } from "../../hooks/useLikeCount";
import { pluralize } from "../../lib/utils";
import { HodlCommentActionButtons } from "./HodlCommentActionButtons";
import { Replies } from "./Replies";
import { DeleteOutlineSharp, ExpandLess, ExpandMore } from "@mui/icons-material";
import { NftContext } from "../../contexts/NftContext";
import { WalletContext } from "../../contexts/WalletContext";
import MoreVertIcon from '@mui/icons-material/MoreVert';

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

    const { address } = useContext(WalletContext);
    const { nft } = useContext(NftContext);

    const canDeleteComment = (comment: HodlCommentViewModel) => comment.user.address === address || nft?.hodler === address;
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

    return (
        <Box
            display="flex"
            flexDirection="column"
            sx={{
                marginLeft: '20px',
            }}
        >
            <Box
                display="flex"
                flexDirection="column"
                sx={{
                    boxSizing: 'border-box',
                    width: `calc(100% + 20px)`,
                    marginLeft: '-20px',
                    marginBottom: 2
                }}
            >
                <Box
                    display="flex"
                    alignItems="start"
                    gap={1.5}
                    sx={{
                        width: `100%`
                    }}
                    id={`hodl-comments-${comment.id}`}>
                    <UserAvatarAndHandle
                        address={comment.user.address}
                        fallbackData={comment.user}
                        size={32}
                        handle={false}
                    />
                    <Box
                        display="flex"
                        flexDirection="column"
                        sx={{
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
                                                fontSize="14px"
                                            />
                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}>
                                            {
                                                address && canDeleteComment(comment) && (<>
                                                    <IconButton
                                                        className="moreMenu"
                                                        onClick={handleClick}
                                                        size="small"
                                                        sx={{
                                                            padding: 0,
                                                            // visibility: 'hidden'
                                                        }}
                                                    >
                                                        <MoreVertIcon
                                                            sx={{
                                                                cursor: 'pointer',
                                                                color: theme => theme.palette.text.secondary,
                                                                '&:hover': {
                                                                    color: theme => theme.palette.text.primary,
                                                                },
                                                                fontSize: 12
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
                                    </Box>
                                    <Typography sx={{ whiteSpace: 'pre-line', marginTop: 0, marginBottom: 0 }}>{comment.comment}</Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                        marginTop: 1,
                                        marginBottom: 0.5
                                        
                                    }}>
                                    <Typography
                                        sx={{
                                            color: theme => theme.palette.text.secondary,
                                            fontSize: 12
                                        }}>
                                        {comment.timestamp && formatDistanceStrict(new Date(comment.timestamp), new Date(), { addSuffix: false })}
                                    </Typography>
                                    {address &&
                                            <Box
                                                sx={{
                                                    cursor: 'pointer',
                                                    color: theme => theme.palette.text.secondary,
                                                    '&:hover': {
                                                        color: theme => theme.palette.text.primary,
                                                    },
                                                    fontSize: 12
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
                                                }>
                                                reply
                                            </Box>
                                    }
                                </Box>
                                {Boolean(countSWR?.data) && <Box
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
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.25,
                                        color: theme => theme.palette.text.secondary,
                                        cursor: 'pointer',
                                        '&:hover': {
                                            color: theme => theme.palette.text.primary
                                        },
                                        // background: 'orange',
                                        marginTop: 2
                                    }}
                                >
                                    {showThread ?

                                        <ExpandLess sx={{ fontSize: 12 }} /> :
                                        <ExpandMore sx={{ fontSize: 12 }} />
                                    }
                                    {
                                        countSWR.data && showThread && !swr.error && !swr.data ?
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
                                                {level < 4 ? pluralize(countSWR.data, 'reply') : 'thread'}
                                            </Typography>
                                    }
                                </Box>}
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
