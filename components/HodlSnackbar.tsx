import { forwardRef, useState, useImperativeHandle } from 'react'
import { Snackbar, Alert, AlertColor } from '@mui/material'


export const HodlSnackbar = forwardRef((props, ref) => {
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMsg, setSnackBarMsg] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>('success');

    useImperativeHandle(ref, () => ({
        display(message, severity: AlertColor = "success") {
            setAlertSeverity(severity);
            setSnackBarOpen(false);
            setSnackBarMsg(message);
            setSnackBarOpen(true);
        }
    }));

    return (
        <Snackbar
            open={snackBarOpen}
            autoHideDuration={2500}
            onClose={() => setSnackBarOpen(false)}
        >
            <Alert sx={{ padding: 2, fontSize: 18 }} severity={alertSeverity}>{snackBarMsg}</Alert>
        </Snackbar>
    )
})

HodlSnackbar.displayName = 'HodlSnackbar'