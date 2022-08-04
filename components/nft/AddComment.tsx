import { Typography, Box, Tooltip } from "@mui/material";
import { FC, useContext } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { Formik, Form, Field } from "formik";
import { InputBase } from 'formik-mui';
import { AddCommentValidationSchema } from "../../validationSchema/comments/addComments";
import { useAddComment } from "../../hooks/useComments";
import { HodlComment } from "../../models/HodlComment";
import { QuoteComment } from "./QuoteComment";
import { NftContext } from "../../contexts/NftContext";


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
    const { address } = useContext(WalletContext);
    const [addComment] = useAddComment();
    const { nft } = useContext(NftContext);
    
    const reset = () => {
        setCommentingOn({
            object,
            objectId,
            mutateList,
            mutateCount,
            setShowThread: () => null,
            color: "primary"
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
                objectId: commentingOn.objectId,
                object: commentingOn.object,
                tokenId
            }}
            validationSchema={AddCommentValidationSchema}
            onSubmit={async (values) => {
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
                // TODO: NEED TO MUTATE THE TOP LEVEL COUNT

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
                                        gap={1}
                                        sx={{

                                            border: values.comment && errors.comment ? theme => `1px solid ${theme.palette.error.main}` : `1px solid #ccc`,
                                            borderRadius: 1,
                                            padding: 1,
                                        }}
                                    >
                                        {
                                            commentingOn.object === "comment" &&
                                            <QuoteComment id={commentingOn.objectId} color={commentingOn.color} reset={reset} />
                                        }
                                        <Field
                                            validateOnChange
                                            autoComplete='off'
                                            inputRef={newTagRef}
                                            component={InputBase}
                                            sx={{
                                                flexGrow: 1,
                                                paddingX: 0.5
                                            }}
                                            placeholder={
                                                commentingOn.object === "comment" ? "Add Reply" : "Add Comment"
                                            }
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