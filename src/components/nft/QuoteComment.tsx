import useSWR from "swr";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";

import { fetchWithId } from "../../lib/swrFetchers";
import { truncateText } from "../../lib/truncateText";
import { ProfileNameOrAddress } from "../avatar/ProfileNameOrAddress";


export const QuoteComment = ({ reset, id, color }) => {
    const { data: comment } = useSWR(
        id ? [`/api/comment`, id] : null,
        fetchWithId
    );

    return (
        <Box
            position="relative"
            sx={{
                background: '#fafafa',
                padding: 1,
                marginBottom: 2,
                borderRadius: 0.5,
                borderLeft: "3px solid #999",
                borderColor: theme => theme.palette[color].main
            }}
        >
            <div>
                <ProfileNameOrAddress profileAddress={comment?.user?.address} fallbackData={comment?.user} color={color} />
                <Typography sx={{ color: '#666' }}>{truncateText(comment?.comment || '...', 80)}</Typography>
            </div>
            <HighlightOffOutlinedIcon
                sx={{ cursor: 'pointer', position: 'absolute', right: 8, top: 8, color: '#999' }}
                fontSize="inherit"
                onClick={() => {
                    reset();
                }
                } />
        </Box>
    )
}