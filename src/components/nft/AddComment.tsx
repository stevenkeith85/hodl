import { FC, useContext, useState } from "react";

import { Formik, Form } from "formik";
import { AddCommentValidationSchema } from "../../validation/comments/addComments";
import { useAddComment } from "../../hooks/useComments";
import { HodlComment } from "../../models/HodlComment";
import { QuoteComment } from "./QuoteComment";
import { green, red } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles"
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Typography from "@mui/material/Typography";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Button from "@mui/material/Button";
import { SignedInContext } from "../../contexts/SignedInContext";

interface AddCommentProps {
    tokenId?: number, // we always store the tokenId this comment was made against to allow us to link to it; give the token owner permission to delete, etc
    objectId: number, // the base object we will be commenting on
    object: "token" | "comment", // the base object type we will be commenting on
    commentingOn: any, // this will be a sub comment, or the base object
    setCommentingOn: Function,
    setLoading: Function,
    mutateList: Function,
    mutateCount: Function,
    newTagRef: any
}

export const AddComment: FC<AddCommentProps> = ({
    tokenId, // TODO: We don't need to pass this now, as we have access to 'nft' via the context
    objectId,
    object,
    commentingOn,
    setCommentingOn,
    setLoading,
    mutateList,
    mutateCount,
    newTagRef
}) => {
    const { signedInAddress: address } = useContext(SignedInContext);
    const [addComment] = useAddComment();
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const reset = () => {
        setCommentingOn({
            object,
            objectId,
            mutateList,
            mutateCount,
            setShowThread: () => null,
            color: "primary"
        });
    }

    if (!address) {
        return null;
    }

    return (
        <Formik
            initialValues={{
                comment: '',
                objectId: commentingOn.objectId,
                object: commentingOn.object,
                tokenId
            }}
            validationSchema={AddCommentValidationSchema}
            onSubmit={async (values, actions) => {
                const comment: HodlComment = {
                    tokenId: tokenId,
                    object: commentingOn.object,
                    objectId: commentingOn.objectId,
                    subject: address,
                    comment: values.comment,
                }
                setLoading(true);

                await addComment(comment);

                commentingOn.setShowThread(true);
                commentingOn.mutateList();
                commentingOn.mutateCount();


                mutateCount();
                // TODO: NEED TO MUTATE THE TOP LEVEL COUNT ??

                newTagRef.current.value = "";
                actions.setFieldValue('comment', '');
                reset();

                setLoading(false);
            }}
        >
            {({ errors, values, setFieldValue, isValid, submitForm, }) => (
                <>
                    <Form>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginTop: 0
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    position: "relative",
                                    flexGrow: 1,
                                    gap: theme.spacing(1)
                                }} >
                                <Tooltip title={errors?.comment || ''} >
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        gap={0}
                                        sx={{
                                            paddingTop: 2,
                                            marginTop: 2,
                                            borderTop: `1px solid #ddd`,
                                            '#hodl-comments-add': {
                                                border: 'none',
                                                outline: 'none',
                                                fontFamily: theme => theme.typography.fontFamily,
                                                fontSize: theme => theme.typography.fontSize,
                                                resize: 'none'
                                            }

                                        }}
                                    >
                                        {
                                            commentingOn.object === "comment" &&
                                            <QuoteComment id={commentingOn.objectId} color={commentingOn.color} reset={reset} />
                                        }
                                        <TextareaAutosize
                                            onKeyDown={async e => {
                                                if (e.ctrlKey && e.code === "Enter") {
                                                    await submitForm();
                                                }
                                            }}
                                            onChange={(e) => {
                                                setFieldValue('comment', e.target.value);
                                            }}
                                            autoComplete='off'
                                            ref={newTagRef}
                                            placeholder={
                                                commentingOn.object === "comment" ? "Your reply ?" : "Your comment ?"
                                            }
                                            minRows={2}
                                            name="comment"
                                            id="hodl-comments-add"
                                        />


                                    </Box>
                                </Tooltip>
                                <Box display="flex" justifyContent="right" alignItems="center" gap={2}>
                                    <Typography
                                        sx={{
                                            fontSize: 10,
                                            paddingLeft: 0.75,
                                            color: isValid ? green : red
                                        }}>{values?.comment?.length} / 400
                                    </Typography>
                                    <ClickAwayListener
                                        onClickAway={() => setOpen(false)}>
                                        <Box>
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 50,
                                                    right: 0,
                                                    display: open ? 'block' : 'none'
                                                }}
                                            >
                                            </Box>
                                        </Box>
                                    </ClickAwayListener>
                                    <Tooltip title="ctrl + enter">
                                        <Button
                                            disabled={!isValid}
                                            type="submit"
                                        >
                                            {commentingOn.object === "comment" ? "reply" : "comment"}
                                        </Button>
                                    </Tooltip>
                                </Box>
                            </div>
                        </div>
                    </Form>
                </>)}
        </Formik>
    )
}