import { Typography, Box } from "@mui/material";
import axios from 'axios';
import useSWR from "swr";
import { HighlightOffOutlined } from "@mui/icons-material";
import { fetchWithId } from "../../lib/swrFetchers";
import { truncateText } from "../../lib/utils";


export const QuoteComment = ({ reset, id }) => {
    const { data: comment } = useSWR(
        id ? [`/api/comment`, id] : null,
        fetchWithId,
        {
            revalidateOnMount: true
        }
    );

    const { data: commenter } = useSWR(
        comment && comment.subject ? [`/api/profile/nickname`, comment.subject] : null,
        (url, query) => axios.get(`${url}?address=${query}`).then(r => r.data.nickname),
        {
            revalidateOnMount: true
        }
    )

    return (
        <Box
            position="relative"
            sx={{
                background: '#f0f0f0',
                padding: 1,
                borderRadius: 0.5,
                borderLeft: "5px solid #999"
            }}
        >
            <Box>
                <Typography sx={{ fontWeight: 'bold' }}>{commenter}</Typography>
                <Typography sx={{ color: '#666' }}>{truncateText(comment?.comment || '...')}</Typography>
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