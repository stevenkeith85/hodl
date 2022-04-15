import { Stack } from "@mui/material";
import { useNickname } from "../../hooks/useNickname";
import { HodlButton } from "../HodlButton";
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { HodlFormikTextField } from "../formFields/HodlFormikTextField";
import { isValidAddress } from "../../lib/profile";

const validationSchema = yup.object({
    nickname: yup
        .string()
        .ensure()
        .min(3)
        .max(30)
        .lowercase().strict()
        .required()
        .test('isNotAnAddress', 'You cannot set your nickname to an address', async value => !(await isValidAddress(value)))
  });

export const NicknameForm = ({onSuccess=null}) => {
    const [update, apiError, setApiError, nickname] = useNickname();

    return (
        <>
            <Formik
                initialValues={{ nickname: nickname }}
                validationSchema={validationSchema}
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
                            <HodlButton type="submit" disabled={isSubmitting || apiError}>
                                Submit
                            </HodlButton>
                        </Stack>
                    </Form>
                )}
            </Formik>
        </>
    );
}
