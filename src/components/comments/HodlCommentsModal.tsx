import { HodlCommentsBox } from "./HodlCommentsBox";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import { useRouter } from "next/router";

// TODO: If the modal is closed on a sub level of comment thread; we should reset
// Possibly have taken care of this todo now. need to check
export default function HodlCommentsModal({ open, setOpen }) {
    const router = useRouter();
    return (
        <Dialog
            PaperProps={{
                sx: {
                    overflow: 'visible'
                }
            }}

            maxWidth="sm"
            fullWidth
            disableRestoreFocus={true}
            open={open}
            onClose={(e) => {
                // @ts-ignore
                e.stopPropagation();

                // @ts-ignore
                e.preventDefault();

                router.push('/feed', undefined, { shallow: true });

                setOpen(false);
            }}
        >
            <Box
                onClick={e => {
                    e.stopPropagation();
                }}>
                <HodlCommentsBox
                    limit={10}
                    height="350px"
                />
            </Box>
        </Dialog >
    )
}
