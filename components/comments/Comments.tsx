import { CommentOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { HodlModal } from "../modals/HodlModal";
import { HodlCommentsBox } from "./HodlCommentsBox";
import { FC, useState } from "react";
import { useCommentCount } from "../../hooks/useComments";
import humanize from "humanize-plus";

export interface CommentsProps {
    nft: any,
    popUp?: boolean,
    color?: "inherit" | "disabled" | "action" | "secondary" | "primary" | "error" | "info" | "success" | "warning",
    fontSize?: string,
    prefetchedCommentCount?: null | number,
    sx?: any
}

export const Comments: FC<CommentsProps> = ({
    nft,
    popUp = true,
    color = "primary",
    fontSize = "20px",
    prefetchedCommentCount = null,
    sx = {}
}) => {
    const { data: count } = useCommentCount(nft.tokenId, "token", prefetchedCommentCount)

    const [open, setOpen] = useState(false);

    const [topLevel, setTopLevel] = useState<{
        objectId: number,
        object: "token" | "comment"
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
            <HodlModal
                open={open}
                setOpen={setOpen}
                sx={{
                    padding: 2,
                    width: {
                        xs: '90vw',
                    },
                    maxWidth: "900px"
                }}
            >
                <HodlCommentsBox
                    tokenId={nft.tokenId}
                    setTopLevel={setTopLevel}
                    clearTopLevel={clearTopLevel}
                    objectId={topLevel.objectId}
                    object={topLevel.object}
                    prefetchedComments={null}
                    prefetchedCommentCount={prefetchedCommentCount}
                    limit={10}
                    maxHeight="60vh"
                    minHeight="30vh"
                />
            </HodlModal>
            <Box
                display="flex"
                gap={0.75}
                sx={{
                    color: color,
                    alignItems: "center",
                    cursor: 'pointer',
                    paddingRight: 1.5,
                    ...sx
                }}
                onClick={e => {
                    e.stopPropagation();
                    // e.preventDefault();
                    if (popUp) {
                        setOpen(true)
                    } else {
                        // @ts-ignore
                        document.querySelector('#hodl-comments-add')?.focus()
                    }
                }}
            >
                <CommentOutlined
                    color={color}
                    sx={{ fontSize }} />

                {(count != undefined) &&
                    <Typography
                        sx={{
                            fontSize: `calc(${fontSize} - 6px)`
                        }}>
                        {humanize.compactInteger(count, 1)}
                    </Typography>
                }
            </Box>

        </>
    )
}