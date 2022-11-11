import { FC, useState } from "react";

import dynamic from 'next/dynamic';

import Box from "@mui/material/Box";

import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";

import useSWR, { Fetcher } from "swr";
import humanize from "humanize-plus";

import { useCommentCount } from "../../hooks/useComments";
import { NftContext } from "../../contexts/NftContext";

import { MutableToken } from "../../models/Nft";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

const HodlCommentsModal = dynamic(
    () => import('./HodlCommentsModal'),
    {
        ssr: false,
        loading: () => null
    }
);

export interface CommentsProps {
    nft: any,
    popUp?: boolean,
    color?: "inherit" | "disabled" | "action" | "secondary" | "primary" | "error" | "info" | "success" | "warning",
    size?: number,
    fontSize?: number,
    sx?: any;
    prefetchedCommentCount?: any;
}

export const Comments: FC<CommentsProps> = ({
    nft,
    popUp = true,
    color = "primary",
    size = 22,
    fontSize = 14,
    sx = {},
    prefetchedCommentCount = null
}) => {
    const { data: count } = useCommentCount(nft?.id, "token", prefetchedCommentCount)

    const mutableTokenFetcher: Fetcher<MutableToken> = (url, id) => fetch(`${url}/${id}`).then(r => r.json()).then(data => data.mutableToken);
    const { data: mutableToken } = useSWR([`/api/contracts/mutable-token`, nft.id], mutableTokenFetcher);

    const [open, setOpen] = useState(false);

    return (
        <>
            <NftContext.Provider
                value={{
                    nft,
                    mutableToken
                }}
            >
                {open && <HodlCommentsModal open={open} setOpen={setOpen} />}
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
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (popUp) {
                            setOpen(true)
                        } else {
                            // @ts-ignore
                            document.querySelector('#hodl-comments-add')?.focus()
                        }
                    }}
                >
                    <CommentOutlinedIcon color={color} sx={{ fontSize: size }} />
                    {count === null && <Skeleton variant="text"><Typography>0</Typography></Skeleton>}
                    {count !== null &&
                        <Typography sx={{ fontSize, color }}>{humanize.compactInteger(count || 0, 1)}</Typography>
                    }
                </Box>
            </NftContext.Provider>
        </>
    )
}
