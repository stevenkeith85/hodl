import { Button, Stack } from "@mui/material";
import { useNickname } from "../../hooks/useNickname";
import { Formik, Form } from 'formik';
import { HodlFormikTextField } from "../formFields/HodlFormikTextField";
import { nicknameValidationSchema } from "../../validationSchema/nickname";


export const NicknameForm = ({onSuccess=null}) => {
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
                {({ isSubmitting }) => (
                    <Form>
                        <Stack spacing={2}>
                            <HodlFormikTextField name="nickname" type="text" label="nickname" apiError={apiError} setApiError={setApiError}/>
                            <Button type="submit" disabled={isSubmitting || apiError}>
                                Submit
                            </Button>
                        </Stack>
                    </Form>
                )}
            </Formik>
        </>
    );
}
