import { CommentOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { HodlModal } from "./HodlModal";
import { HodlCommentsBox } from "./nft/HodlCommentsBox";
import { FC, useState } from "react";
import { useCommentCount } from "../hooks/useComments";

export interface CommentsProps {
    nft: any,
    popUp?: boolean,
    color?: "inherit" | "disabled" | "action" | "secondary" | "primary" | "error" | "info" | "success" | "warning",
    fontSize?: "small" | "inherit" | "large" | "medium",
    prefetchedCommentCount?: null | number,
    sx?: any
}

export const Comments: FC<CommentsProps> = ({ 
    nft, 
    popUp = true, 
    color = "primary", 
    fontSize = "small", 
    prefetchedCommentCount=null, 
    sx = {} 
}) => {
    const {data:count} = useCommentCount(nft.tokenId, "token", prefetchedCommentCount)

    const [open, setOpen] = useState(false);

    const [topLevel, setTopLevel] = useState<{
        objectId:number, 
        object:"token" | "comment"
    }>({
        objectId: nft.tokenId, 
        object: "token"
    })

    const clearTopLevel = () => {
        setTopLevel({
            objectId: nft.tokenId, 
            object: "token"
        })   
    }

    return (
        <>
            <HodlModal open={open} setOpen={setOpen} sx={{ padding: 0, width: { xs: '90vw', md: '60vw' } }} >
                <HodlCommentsBox 
                    tokenId={nft.tokenId}
                    setTopLevel={setTopLevel}
                    clearTopLevel={clearTopLevel}
                    objectId={topLevel.objectId} 
                    object={topLevel.object}
                    prefetchedComments={null} 
                    prefetchedCommentCount={prefetchedCommentCount} 
                    limit={10} 
                    maxHeight="50vh" 
                />
            </HodlModal>
            <Box
                display="flex"
                gap={0.5}
                sx={{
                    color: color,
                    alignItems: "center",
                    cursor: 'pointer',
                    paddingRight: 1.5,
                    ...sx
                }}
                onClick={() => {
                    if (popUp) {
                        setOpen(true)
                    } else {
                        // @ts-ignore
                        document.querySelector('#hodl-comments-add')?.focus()
                    }
                }}
            >
                <CommentOutlined color={color} fontSize={fontSize} />
                {count < 1000 ?
                    <Typography>{count}</Typography> :
                    <Typography sx={{span: {position: 'relative', top: '-6px', fontSize: '12px'} }}>1k<span>+</span></Typography>
                }
            </Box>

        </>
    )
}