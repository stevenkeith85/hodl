import { Box, Modal } from "@mui/material";

// Start simple
export const HodlModal = ({ open, setOpen, children, ref = null, sx = {} }) => {
    return (
        <Modal
            open={open}
            onClose={(e) => { 
                // @ts-ignore
                e.stopPropagation(); 
                setOpen(false);
            }}
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
                }}>
                {children}
            </Box>
        </Modal>
    )
}