import { Box, Modal } from "@mui/material";

// Start simple
export const HodlModal = ({open, setOpen, children}) => {
    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
        >
        <Box 
            sx={{
                position: 'absolute' as 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
        }}>
            { children }
        </Box>
      </Modal>
    )
}