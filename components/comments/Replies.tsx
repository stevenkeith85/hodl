import { Typography, Box } from "@mui/material";
import React, { } from "react";
import { HodlCommentViewModel } from "../../models/HodlComment";
import { HodlCommentBox } from "./HodlCommentBox";


export const Replies = ({
    countSWR,
    showThread,
    swr,
    setCommentingOn,
    addCommentInput,
    setTopLevel,
    mutateCount,
    parentColor,
    level
}) => {

    const colors: ("primary" | "secondary")[] = ["primary", "secondary"];
    const firstIndex = colors.indexOf(parentColor) + 1

    if (!showThread) {
        return null;
    }

    if (!countSWR.data) {
        return null;
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            sx={{
                width: '100%',
                marginTop: 3,
            }}
        >
            {
                swr?.data?.map(({ items, next, total }) => items.map(
                    (comment: HodlCommentViewModel, i: number) => <HodlCommentBox
                        key={`hodl-comments-${comment.id}`}
                        comment={comment}
                        color={colors[(firstIndex + i) % 2]}
                        setCommentingOn={setCommentingOn}
                        addCommentInput={addCommentInput}
                        parentMutateList={swr.mutate}
                        parentMutateCount={countSWR.mutate}
                        setTopLevel={setTopLevel}
                        mutateCount={mutateCount}
                        level={level + 1}
                    />
                )
                )
            }
            {
                swr.data &&
                swr.data.length &&
                swr.data[swr.data.length - 1].next !== swr.data[swr.data.length - 1].total &&
                <Typography
                    sx={{
                        fontSize: 10,
                        color: "#999",
                        cursor: 'pointer',
                        marginY: 1,
                        marginLeft: '20px'
                    }}
                    onClick={() => swr.setSize(old => old + 1)}
                >
                    more replies ...
                </Typography>
            }
        </Box>
    )
}
