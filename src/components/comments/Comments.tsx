import { FC, useState } from "react";

import dynamic from 'next/dynamic';

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { CommentOutlined } from "@mui/icons-material";

import useSWR, { Fetcher } from "swr";
import humanize from "humanize-plus";

import { useCommentCount } from "../../hooks/useComments";
import { NftContext } from "../../contexts/NftContext";

import { MutableToken } from "../../models/Nft";

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
    fallbackData?: any;
}

export const Comments: FC<CommentsProps> = ({
    nft,
    popUp = true,
    color = "primary",
    size = 22,
    fontSize = 14,
    sx = {},
    fallbackData = null
}) => {
    const { data: count } = useCommentCount(nft?.id, "token", fallbackData)

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
                <HodlCommentsModal open={open} setOpen={setOpen} />
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
                    <CommentOutlined color={color} sx={{ fontSize: size }} />
                    <p style={{ fontSize, color, margin: 0 }}>{humanize.compactInteger(count || 0, 1)}</p>
                </Box>
            </NftContext.Provider>
        </>
    )
}
