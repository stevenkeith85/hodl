import {  Tooltip, Box, Button, Stack, Typography } from "@mui/material";
import { HodlModal } from "./HodlModal";
import axios from "axios";
import { token } from "../../lib/copyright";
import { useNickname } from "../../hooks/useNickname";
import { Formik, Form, Field } from 'formik';
import { nicknameValidationSchema } from "../../validationSchema/nickname";
import { InputBase } from "formik-mui";


export const NicknameModal = ({ nicknameModalOpen, setNicknameModalOpen }) => {
    const [update, apiError, setApiError, nickname] = useNickname();

    return (
        <>
            <HodlModal
                open={nicknameModalOpen}
                setOpen={setNicknameModalOpen}
            >
                <Stack spacing={3} textAlign="center">
                    <Typography variant="h2" sx={{ fontSize: '18px', fontWeight: 600 }}>Nickname</Typography>
                    <Typography sx={{ fontSize: '18px', color: '#999' }}>Enter a nickname to use as an alias for your wallet address</Typography>
                    <Formik
                        initialValues={{ nickname: nickname }}
                        validationSchema={nicknameValidationSchema}
                        onSubmit={async (values, { setSubmitting }) => {
                            setSubmitting(true);
                            const success = await update(values.nickname);
                            setSubmitting(false);

                            if (success) {
                                setNicknameModalOpen(false);
                            }
                        }}
                    >
                        {({ isSubmitting, errors, setFieldValue }) => (
                            <Form>
                                <Stack spacing={2}>
                                    <Tooltip title={errors?.nickname || apiError || ''} >
                                        <Field
                                            validateOnChange
                                            autoComplete='off'
                                            component={InputBase}
                                            sx={{
                                                border: (errors.nickname || apiError) ? theme => `1px solid ${theme.palette.error.main}` : `1px solid #ccc`,
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
                                    </Tooltip>

                                    <Box display="grid" gridTemplateColumns={"1fr 1fr"} gap={4}>
                                        <Button
                                            disabled={isSubmitting || apiError}
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                paddingY: 1.5,
                                                paddingX: 3
                                            }}
                                            onClick={async () => {
                                                if (token) {
                                                    try {
                                                        const r = await axios.post(
                                                            '/api/profile/picture',
                                                            { token },
                                                            {
                                                                headers: {
                                                                    'Accept': 'application/json',
                                                                },
                                                            }
                                                        );



                                                    } catch (error) {
                                                    }
                                                }
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
                                                setNicknameModalOpen(false)
                                            }}
                                        >
                                            Cancel
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
