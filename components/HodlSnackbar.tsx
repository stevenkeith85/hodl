import { forwardRef, useState, useImperativeHandle } from 'react'
import { Snackbar, Alert } from '@mui/material'


export const HodlSnackbar = forwardRef((props, ref) => {
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMsg, setSnackBarMsg] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    useImperativeHandle(ref, () => ({
        display(message, severity = "success") {
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
