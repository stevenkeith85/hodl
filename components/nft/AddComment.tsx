import { Typography, Box, Tooltip } from "@mui/material";
import { FC, useContext } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { Formik, Form, Field } from "formik";
import { InputBase } from 'formik-mui';
import { AddCommentValidationSchema } from "../../validationSchema/comments/addComments";
import { useAddComment } from "../../hooks/useComments";
import { HodlComment } from "../../models/HodlComment";
import { QuoteComment } from "./QuoteComment";


interface AddCommentProps {
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
    objectId,
    object,
    commentingOn,
    setCommentingOn,
    setLoading,
    mutateList,
    mutateCount,
    newTagRef
}) => {
    const { address } = useContext(WalletContext);
    const [addComment] = useAddComment();

    const reset = () => {
        setCommentingOn({
            object,
            objectId: Number(objectId),
            mutateList,
            mutateCount,
            setShowThread: () => null
        });
        setTimeout(() => {
            // @ts-ignore
            newTagRef?.current?.focus();
        });
    }

    if (!address) {
        return null;
    }

    return (
        <Formik
            initialValues={{
                comment: '',
                id: commentingOn.objectId,
                object: commentingOn.object,
            }}
            validationSchema={AddCommentValidationSchema}
            onSubmit={async (values) => {
                const comment: HodlComment = {
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

                values.comment = '';
                reset();

                setLoading(false);
            }}
        >
            {({ errors, values }) => (
                <>
                    {/* {JSON.stringify(errors)}
                                {JSON.stringify(values)} */}
                    <Form>
                        <Box display="flex" alignItems="center" marginTop={2}>
                            <Tooltip title={errors?.comment || ''} >
                                <Box display="flex" flexDirection="column" position="relative" flexGrow={1}>
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        gap={0.5}
                                        sx={{

                                            border: errors.comment ? theme => `1px solid ${theme.palette.error.main}` : `1px solid #ccc`,
                                            borderRadius: 1,
                                            padding: 1,
                                        }}
                                    >
                                        {
                                            commentingOn.object === "comment" &&
                                            <QuoteComment id={commentingOn.objectId} reset={reset} />
                                        }
                                        <Field
                                            validateOnChange
                                            autoComplete='off'
                                            inputRef={newTagRef}
                                            component={InputBase}
                                            sx={{
                                                flexGrow: 1,
                                            }}
                                            placeholder="Message"
                                            name="comment"
                                            id="hodl-comments-add"
                                            type="text"
                                        />
                                    </Box>
                                </Box>
                            </Tooltip>
                            <Typography sx={{ textAlign: 'right', fontSize: 10, paddingLeft: 0.75 }}>{values?.comment?.length} / 150</Typography>
                        </Box>
                    </Form>
                </>)}
        </Formik>
    )
}