import { FC, useState } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { CommentOutlined } from "@mui/icons-material";

import humanize from "humanize-plus";

import { HodlModal } from "../modals/HodlModal";
import { HodlCommentsBox } from "./HodlCommentsBox";
import { useCommentCount } from "../../hooks/useComments";
import { NftContext } from "../../contexts/NftContext";


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
                        maxWidth: "1200px",
                       maxHeight: '90vh',
                       overflow: 'auto'
                    }}
                >
                    <HodlCommentsBox
                        limit={10}
                        maxHeight="80vh"
                        minHeight="40vh"
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
                        sx={{ 
                            fontSize: size
                        }} 
                    />
                        <Typography
                            sx={{
                                fontSize,
                                color
                            }}>
                            {humanize.compactInteger(count || 0, 1)}
                        </Typography>
                </Box>
            </NftContext.Provider>
        </>
    )
}