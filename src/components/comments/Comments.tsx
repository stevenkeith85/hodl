import { FC, useState } from "react";
import dynamic from 'next/dynamic';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import humanize from "humanize-plus";
import { useCommentCount } from "../../hooks/useCommentCount";
import { NftContext } from "../../contexts/NftContext";
import useSWR from "swr";
import { fetchWithId } from "../../lib/swrFetchers";
import { useRouter } from "next/router";


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
    const { data: count } = useCommentCount(nft?.id, "token", prefetchedCommentCount);
    const { data: comment } = useSWR(
        nft?.id ? [`/api/comments/pinned`, nft?.id] : null,
        fetchWithId,
        {
            fallbackData: null
        }
    );

    const [open, setOpen] = useState(false);

    return (
        <>
            <NftContext.Provider
                value={{
                    nft,
                    pinnedComment: comment
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
                            setOpen(true);
                        } else {
                            // @ts-ignore
                            document.querySelector('#hodl-comments-add')?.focus()
                        }
                    }}
                >
                    <CommentOutlinedIcon color={color} sx={{ fontSize: size }} />
                    {count !== null &&
                        <Typography sx={{ fontSize, color }}>{humanize.compactInteger(count || 0, 1)}</Typography>
                    }
                </Box>
            </NftContext.Provider>
        </>
    )
}
