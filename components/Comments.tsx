import { CommentOutlined } from "@mui/icons-material";
import useSWR from "swr";
import axios from 'axios';
import { Badge, Box, Stack, Typography } from "@mui/material";
import { HodlModal } from "./HodlModal";
import { HodlCommentsBox } from "./nft/HodlCommentsBox";
import { FC, useState } from "react";

export interface CommentsProps {
    nft: any,
    popUp?: boolean,
    color?: "inherit" | "disabled" | "action" | "secondary" | "primary" | "error" | "info" | "success" | "warning",
    fontSize?: "small" | "inherit" | "large" | "medium",
    sx?: any
}

export const Comments: FC<CommentsProps> = ({ nft, popUp = true, color = "primary", fontSize = "small", sx = {} }) => {
    const { data: count } = useSWR(nft.tokenId ? [`/api/comments/count`, nft.tokenId] : null,
        (url, tokenId) => axios.get(`${url}?token=${tokenId}`).then(r => r.data.count));

    const [open, setOpen] = useState(false);

    return (
        <>
            <HodlModal open={open} setOpen={setOpen} sx={{ padding: 0, width: { xs: '90vw', md: '50vw' } }} >
                <HodlCommentsBox nft={nft} prefetchedComments={null} prefetchedCommentCount={null} limit={20} maxHeight="50vh" />
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