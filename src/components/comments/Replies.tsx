import React from "react";
import { useTheme } from "@mui/material/styles"
import Typography from "@mui/material/Typography";
import { HodlCommentViewModel } from "../../models/HodlComment";
import { HodlCommentBox } from "./HodlCommentBox";


export const Replies = ({
    showThread,
    swr,
    addCommentInput,
    parentColor,
    level
}) => {

    const theme = useTheme();
    const colors: ("primary" | "secondary")[] = ["primary", "secondary"];
    const firstIndex = colors.indexOf(parentColor) + 1

    if (!showThread) {
        return null;
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                paddingTop: '8px'
                // marginTop: theme.spacing(1),
                // marginBottom: theme.spacing(-2)
            }}
        >
            {
                swr?.data?.map(({ items, next, total }) => items.map(
                    (comment: HodlCommentViewModel, i: number) => <HodlCommentBox
                        key={`hodl-comments-${comment.id}`}
                        comment={comment}
                        color={colors[(firstIndex + i) % 2]}
                        addCommentInput={addCommentInput}
                        parentMutateList={swr.mutate}
                        level={level + 1}
                    />
                )
                )
            }
            {
                swr.data &&
                swr.data.length &&
                swr.data[swr.data.length - 1].next <= swr.data[swr.data.length - 1].total &&
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
        </div>
    )
}
