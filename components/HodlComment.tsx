import { Typography, Box, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { ProfileAvatar } from "./ProfileAvatar";
import formatDistance from 'date-fns/formatDistance';
import { yellow } from '@mui/material/colors';

export const HodlComment = ({ comment, color = "secondary", sx = {} }) => {
    const router = useRouter();

    const selected = router?.query?.comment === `${comment.subject}-${comment.timestamp}`;

    return (
        <Box paddingY={0.5} sx={{ background: selected ? yellow[100] : 'none', ...sx }} id={`hodl-comments-${comment.subject}-${comment.timestamp}`}>
            <Stack direction="row" spacing={1} display="flex" alignItems="center">
                <ProfileAvatar profileAddress={comment.subject} size="small" />
                <Box display="flex" alignItems="center">
                    <Typography
                        sx={{
                            color: theme => theme.palette[color].light,
                            span: { fontSize: 10, color: "#999" }
                        }}>
                        &quot;{comment.comment}&quot;
                        <span> {comment.timestamp && formatDistance(new Date(comment.timestamp), new Date(), { addSuffix: false })}</span>
                    </Typography>
                </Box>
            </Stack>
        </Box>
    );
};
