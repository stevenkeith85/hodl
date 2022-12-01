import { Tooltip, Box, Button, Stack, Typography } from "@mui/material";
import { HodlModal } from "./HodlModal";
import { useNickname } from "../../hooks/useNickname";
import { Formik, Form, Field } from 'formik';
import { nicknameValidationSchema } from "../../validation/nickname";
import { InputBase } from "formik-mui";
import { useContext, useState } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { useUser } from "../../hooks/useUser";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";


export const NicknameModal = ({ nicknameModalOpen, setNicknameModalOpen }) => {
    const updateNickname = useNickname();

    const { address } = useContext(WalletContext);
    const userSWR = useUser(address);

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    if (!userSWR?.data) {
        return null;
    }


    return (
        <>
            <HodlModal
                open={nicknameModalOpen}
                setOpen={setNicknameModalOpen}
                sx={{
                    maxWidth: '90vw'
                }}
            >
                <Stack spacing={3} textAlign="center">
                    <Typography variant="h2" sx={{ fontSize: '18px', fontWeight: 600 }}>Nickname</Typography>
                    <Typography sx={{
                        color: theme => theme.palette.text.secondary,
                    }}>Enter a nickname to use as an alias for your wallet address</Typography>
                    <Formik
                        initialValues={{ nickname: userSWR?.data?.nickname }}
                        validationSchema={nicknameValidationSchema}
                        onSubmit={async (values, { setSubmitting }) => {
                            setSubmitting(true);
                            setLoading(true);
                            const { success, message } = await updateNickname(values.nickname);
                            setLoading(false);
                            if (success) {
                                userSWR.mutate();
                            }

                            setMessage(message);
                            setSubmitting(false);
                        }}
                    >
                        {({ isSubmitting, errors, setFieldValue }) => (
                            <Form>
                                <Stack spacing={2}>
                                    <Field
                                        validateOnChange
                                        autoComplete='off'
                                        component={InputBase}
                                        sx={{
                                            border: (errors.nickname) ? theme => `1px solid ${theme.palette.error.main}` : `1px solid #ccc`,
                                            borderRadius: 1,
                                            paddingY: 1,
                                            paddingX: 1.5
                                        }}
                                        fullWidth
                                        placeholder=""
                                        name="nickname"
                                        type="text"
                                        onChange={e => {
                                            const value = e.target.value || "";
                                            setFieldValue('nickname', value.toLowerCase());
                                        }}
                                    />
                                    <div style={{ height: '20px', marginBottom: '16px' }}>
                                        {loading ? <HodlLoadingSpinner />
                                            : message
                                        }
                                    </div>
                                    <Box display="grid" gridTemplateColumns={"1fr 1fr"} gap={4}>
                                        <Button
                                            disabled={isSubmitting}
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                paddingY: 1.5,
                                                paddingX: 3
                                            }}
                                        >
                                            Select
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="inherit"
                                            sx={{
                                                paddingY: 1.5,
                                                paddingX: 3
                                            }}
                                            onClick={() => {
                                                setMessage('');
                                                setNicknameModalOpen(false)
                                            }}
                                        >
                                            Close
                                        </Button>
                                    </Box>

                                </Stack>
                            </Form>
                        )}
                    </Formik>
                </Stack>
            </HodlModal>
        </>
    )
}
