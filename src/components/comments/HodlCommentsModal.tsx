import { HodlModal } from "../modals/HodlModal";
import { HodlCommentsBox } from "./HodlCommentsBox";


export default function HodlCommentsModal({open, setOpen}) {
    return (
        <HodlModal
            open={open}
            setOpen={setOpen}
            sx={{
                padding: 0,
                width: '90vw',
                maxWidth: "900px",
                maxHeight: '90vh',
                overflow: 'auto'
            }}
        >
            <HodlCommentsBox
                limit={10}
                height="450px"
            />
        </HodlModal>
    )
}
