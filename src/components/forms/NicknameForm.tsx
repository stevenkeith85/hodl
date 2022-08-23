import { Box, Button, Stack, Tooltip } from "@mui/material";
import { useNickname } from "../../hooks/useNickname";
import { Formik, Form, Field } from 'formik';
import { HodlFormikTextField } from "../formFields/HodlFormikTextField";
import { nicknameValidationSchema } from "../../validation/nickname";
import { InputBase, TextField } from "formik-mui";


export const NicknameForm = ({ onSuccess = null }) => {
    const [update, apiError, setApiError, nickname] = useNickname();

    return (
        <>
            <Formik
                initialValues={{ nickname: nickname }}
                validationSchema={nicknameValidationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    setSubmitting(true);
                    const success = await update(values.nickname);
                    setSubmitting(false);

                    if (success) {
                        onSuccess ? onSuccess() : null
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
                                        border: (errors.nickname || apiError )? theme => `1px solid ${theme.palette.error.main}` : `1px solid #ccc`, 
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
                            <div>
                                <Button type="submit" disabled={isSubmitting || apiError}>
                                    Select
                                </Button>
                            </div>

                        </Stack>
                    </Form>
                )}
            </Formik>
        </>
    );
}
