import { Typography, Box } from "@mui/material";
import axios from 'axios';
import useSWR from "swr";
import { HighlightOffOutlined } from "@mui/icons-material";
import { fetchWithId } from "../../lib/swrFetchers";
import { truncateText } from "../../lib/utils";
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
            <Box>
                <ProfileNameOrAddress profileAddress={comment?.user?.address} fallbackData={comment?.user} color={color}/>
                <Typography sx={{ color: '#666' }}>{truncateText(comment?.comment || '...', 80)}</Typography>
            </Box>
            <HighlightOffOutlined
                sx={{ cursor: 'pointer', position: 'absolute', right: 8, top: 8, color: '#999' }}
                fontSize="inherit"
                onClick={() => {
                    reset();
                }
                } />
        </Box>
    )
}