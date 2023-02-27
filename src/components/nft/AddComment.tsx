import { FC, useContext, useEffect, useState } from "react";

import { Formik, Form } from "formik";
import { AddCommentValidationSchema } from "../../validation/comments/addComments";

import { useAddComment } from "../../hooks/useAddComment";
import { HodlComment } from "../../models/HodlComment";
import { SignedInContext } from "../../contexts/SignedInContext";

import { useTheme } from "@mui/material/styles"

import Box from "@mui/material/Box";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Typography from "@mui/material/Typography";
import { green, red } from "@mui/material/colors";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import dynamic from "next/dynamic";
import { ConnectButton } from "../menu/ConnectButton";
import { CommentsContext } from "../../contexts/CommentsContext";
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import useSWR from "swr";
import { UserAvatarAndHandle } from "../avatar/UserAvatarAndHandle";
import Popper from "@mui/material/Popper";


const QuoteComment = dynamic(
    () => import("./QuoteComment").then(mod => mod.QuoteComment),
    {
        ssr: false,
        loading: () => null
    }
);

interface AddCommentProps {
    tokenId?: number, // we always store the tokenId this comment was made against to allow us to link to it; give the token owner permission to delete, etc
    objectId: number, // the base object we will be commenting on
    object: "token" | "comment", // the base object type we will be commenting on
    setLoading: Function,
    mutateList: Function,
    newTagRef: any
}

export const AddComment: FC<AddCommentProps> = ({
    tokenId, // TODO: We don't need to pass this now, as we have access to 'nft' via the context
    objectId,
    object,
    setLoading,
    mutateList,
    newTagRef: newCommentRef
}) => {
    const { signedInAddress } = useContext(SignedInContext);
    const { commentingOn, setCommentingOn } = useContext(CommentsContext);

    const [addComment] = useAddComment();
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const [prefix, setPrefix] = useState(null);

    const { data: suggestions } = useSWR(
        prefix ? ['/api/autocomplete/nicknames', prefix] : null,
        (url, prefix) => fetch(`${url}?prefix=${prefix}`).then(data => data.json()).then(data => data.suggestions)
    );

    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(null);

    useEffect(() => {
        if (suggestions?.length) {
            setSelectedSuggestionIndex(0);
        } else {
            setSelectedSuggestionIndex(null);
        }

    }, suggestions);

    const reset = () => {
        setCommentingOn({
            object,
            objectId,
            mutateList,
            setShowThread: () => null,
            color: "primary"
        });
    }

    if (!signedInAddress) {
        return <Box sx={{
            display: 'flex',
            alignItems: 'center',
            padding: 2,
            // marginTop: 1,
            borderTop: `1px solid #eee`,
            gap: 1
        }}>
            <ConnectButton variant="outlined" text={"Sign In"} sx={{ padding: 0 }} /><span>to like or comment</span>
        </Box>
    }

    const replacePrefixWithSuggestion = (suggestion, values, setFieldValue) => {
        let replace = `@${prefix}`;
        let re = new RegExp(replace, 'g');
        let updated = values.comment.replace(re, suggestion.address);
        newCommentRef.current.value = updated;
        setFieldValue('comment', updated);
        setPrefix(null);
        newCommentRef.current.focus();
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
                    subject: signedInAddress,
                    comment: values.comment,
                }
                setLoading(true);

                await addComment(comment);

                commentingOn.setShowThread(true);
                commentingOn.mutateList();

                newCommentRef.current.value = "";
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
                                marginTop: 0,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    position: "relative",
                                    flexGrow: 1,
                                    gap: theme.spacing(1),
                                    borderTop: `1px solid #eee`,
                                    padding: 0
                                }} >
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    gap={0}
                                    sx={{
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
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            position: 'relative',
                                            width: '100%'
                                        }}>
                                        <TextareaAutosize
                                            style={{
                                                padding: 16,
                                            }}
                                            onKeyDown={async e => {
                                                if (e.ctrlKey && e.code === "Enter") {
                                                    await submitForm();
                                                }

                                                if (suggestions) {
                                                    if (e.key === "ArrowUp") {
                                                        e.preventDefault();
                                                        setSelectedSuggestionIndex(old => Math.abs((old - 1) % suggestions.length))
                                                    }
                                                    if (e.key === "ArrowDown") {
                                                        e.preventDefault();
                                                        setSelectedSuggestionIndex(old => (old + 1) % suggestions.length)
                                                    }
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();

                                                        replacePrefixWithSuggestion(suggestions[selectedSuggestionIndex], values, setFieldValue);
                                                    }
                                                }

                                            }}
                                            onChange={async (e) => {
                                                const match = e.target.value.match(/@([\d\w._]+)$/);

                                                if (match) {
                                                    setPrefix(match[1]);
                                                } else {
                                                    setPrefix(null)
                                                }

                                                setFieldValue('comment', e.target.value);
                                            }}
                                            autoComplete='off'
                                            ref={newCommentRef}
                                            placeholder={
                                                commentingOn.object === "comment" ? "Your reply?" : "Your comment?"
                                            }
                                            minRows={1}
                                            maxRows={10}
                                            name="comment"
                                            id="hodl-comments-add"
                                        />
                                        <Popper
                                            id={'suggestions'}
                                            open={prefix}
                                            anchorEl={newCommentRef.current}
                                            placement='bottom-start'
                                            sx={{
                                                cursor: 'pointer',
                                                border: '1px solid #ddd',
                                                background: 'white',
                                                zIndex: 1300
                                            }}
                                        >
                                            <Box>
                                                {suggestions?.map((suggestion, index) =>
                                                    <Box
                                                        sx={{
                                                            background: selectedSuggestionIndex === index ? '#fafafa' : 'white',
                                                            padding: 2,
                                                            '&:hover': {
                                                                background: '#fafafa'
                                                            }
                                                        }}
                                                        onClick={() => {
                                                            setSelectedSuggestionIndex(index);
                                                            replacePrefixWithSuggestion(suggestions[index], values, setFieldValue);
                                                        }}
                                                    >
                                                        <UserAvatarAndHandle address={suggestion.address} withLink={false} />
                                                    </Box>
                                                )}
                                            </Box>
                                        </Popper>
                                    </div>
                                </Box>
                                <Box
                                    display="flex"
                                    justifyContent="right"
                                    alignItems="center"
                                    gap={1}
                                    sx={{
                                        paddingX: 2,
                                        paddingBottom: 2
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: 10,
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
                                    <IconButton
                                        disabled={!isValid}
                                        color="primary"
                                        type="submit"

                                    >
                                        <SendIcon sx={{
                                            fontSize: 18
                                        }}

                                        />
                                    </IconButton>
                                </Box>
                            </div>
                        </div>
                    </Form>
                </>)}
        </Formik>
    )
}
