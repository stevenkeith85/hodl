import { useContext } from "react";
import { NftContext } from "../../contexts/NftContext";
import { HodlCommentBox } from "./HodlCommentBox";
import { HodlCommentsBox } from "./HodlCommentsBox";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useRouter } from "next/router";

// TODO: If the modal is closed on a sub level of comment thread; we should reset
export default function HodlCommentsModal({ open, setOpen }) {
    const { pinnedComment } = useContext(NftContext);

    const router = useRouter();
    return (
        <Modal
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
                sx={{
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 24,
                    p: 4,
                    padding: 0,
                    width: {
                        xs: '90%',
                        lg: '1080px'
                    },
                    overflow: 'auto'
                }}
                onClick={e => {
                    e.stopPropagation();
                }}>
                {pinnedComment && <Box
                    sx={{
                        paddingY: 1,
                        paddingX: 2,
                        position: 'relative',
                        borderBottom: `1px solid #eee`
                    }}>
                    <HodlCommentBox comment={pinnedComment} canReply={false} parentMutateList={() => { }} addCommentInput={undefined} />
                </Box>
                }
                <HodlCommentsBox
                    limit={10}
                    height="350px"
                />
            </Box>
        </Modal>
    )
}
