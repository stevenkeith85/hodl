import { useField } from 'formik';
import { TextField } from "@mui/material";

export const HodlFormikTextField = ({ apiError=null, setApiError=null, ...props }: any) => {
    const [field, meta] = useField(props);

    return (
        <>        
        <TextField
            sx={{
                '.MuiFormHelperText-root:first-letter': {
                    textTransform: 'capitalize'
                }
            }}
            onChangeCapture={setApiError ? () => setApiError(null): null}
            error={Boolean(meta.error) || apiError}
            helperText={
                (meta.touched && meta.error ? 
                    meta.error : 
                    null) || apiError
            }
            {...field}
            {...props}
        />
        </>
    )
}
