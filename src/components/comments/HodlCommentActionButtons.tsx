import { Box, Tooltip, IconButton, Menu, MenuList, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { Likes } from "../Likes";
import { DeleteOutlineSharp, MoreHorizOutlined, MoreOutlined, Reply } from "@mui/icons-material";
import { useDeleteComment } from "../../hooks/useComments";
import React, { useContext } from "react";
import { HodlCommentViewModel } from "../../models/HodlComment";
import { WalletContext } from "../../contexts/WalletContext";
import { NftContext } from "../../contexts/NftContext";
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

    return (<Box display="flex" alignItems="center" gap={1} marginX={1}>
        
        {/* {address &&
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
        } */}
        {/* {
            address && canDeleteComment(comment) && (<>
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{
                        padding: 0,
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
        } */}
        
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
                size={16}
                fontSize={12}
                id={comment.id}
                object="comment"
                showCount={true}
                // flexDirection="column"
            />
        }
        
    </Box>)
}
