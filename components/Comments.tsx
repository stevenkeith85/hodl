import { CommentOutlined } from "@mui/icons-material";
import useSWR from "swr";
import axios from 'axios';
import { Stack, Typography } from "@mui/material";
import { HodlModal } from "./HodlModal";
import { HodlCommentsBox } from "./nft/HodlCommentsBox";
import { useState } from "react";

export const Comments = ({ nft, popUp=true, sx={} }) => {
    const { data: count } = useSWR(nft.tokenId ? [`/api/comments/count`, nft.tokenId] : null,
        (url, tokenId) => axios.get(`${url}?token=${tokenId}`).then(r => r.data.count));

        const [open, setOpen] = useState(false);

    return (
        <>
            <HodlModal open={open} setOpen={setOpen} sx={{ padding: 0, width: {xs: '90vw', md: '50vw'}}} >
                <HodlCommentsBox nft={nft} prefetchedComments={null} prefetchedCommentCount={null} limit={12} />
            </HodlModal>
            <Stack direction="row" spacing={0.5} sx={{ display: 'flex', alignItems: 'center', color: 'white', cursor: 'pointer', ...sx }}>
                <CommentOutlined sx={{ fontWeight: '300' }} onClick={() => {
                    if (popUp) {
                        setOpen(true)
                    } else {
                        // @ts-ignore
                        document.querySelector('#hodl-comments-add')?.focus()
                    }
                }} /> <Typography>{count}</Typography>
            </Stack>
        </>
    )
}