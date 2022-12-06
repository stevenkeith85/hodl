import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

export const HodlModal = ({ 
    open, 
    setOpen, 
    children,
    ref = null, 
    sx = {} 
}) => (
    <Modal
        disableRestoreFocus={true}
        open={open}
        onClose={(e) => {
            // @ts-ignore
            e.stopPropagation();

            // @ts-ignore
            e.preventDefault();

            setOpen(false);
        } }
        ref={ref}
    >
        <Box
            sx={{
                position: 'absolute' as 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: 24,
                p: 4,
                ...sx
            }}
            onClick={e => {
                e.stopPropagation();
            } }>
            {children}
        </Box>
    </Modal>
)