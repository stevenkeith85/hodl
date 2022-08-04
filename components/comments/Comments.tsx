import { CommentOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { HodlModal } from "../modals/HodlModal";
import { HodlCommentsBox } from "./HodlCommentsBox";
import { FC, useState } from "react";
import { useCommentCount } from "../../hooks/useComments";
import humanize from "humanize-plus";
import { NftContext } from "../../contexts/NftContext";

export interface CommentsProps {
    nft: any,
    popUp?: boolean,
    color?: "inherit" | "disabled" | "action" | "secondary" | "primary" | "error" | "info" | "success" | "warning",
    fontSize?: string,
    sx?: any
}

export const Comments: FC<CommentsProps> = ({
    nft,
    popUp = true,
    color = "primary",
    fontSize = "20px",
    sx = {}
}) => {
    const { data: count } = useCommentCount(nft.id, "token")

    const [open, setOpen] = useState(false);

    return (
        <>
            <NftContext.Provider
                value={{
                    nft
                }}
            >
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
                        e.preventDefault();
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
                                fontSize: `calc(${fontSize} - 8px)`
                            }}>
                            {humanize.compactInteger(count, 1)}
                        </Typography>
                    }
                </Box>
            </NftContext.Provider>
        </>
    )
}