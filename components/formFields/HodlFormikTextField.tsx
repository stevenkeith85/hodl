import { useField } from 'formik';
import { TextField } from "@mui/material";

export const HodlFormikTextField = ({ apiError=null, setApiError, ...props }: any) => {
    const [field, meta] = useField(props);

    return (
        <>        
        <TextField
            onChangeCapture={() => setApiError(null)}
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
