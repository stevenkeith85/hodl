import { Typography, Box, Stack, Link, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import { ProfileAvatar } from "./ProfileAvatar";
import formatDistance from 'date-fns/formatDistance';
import { yellow } from '@mui/material/colors';
import axios from 'axios'
import useSWR from "swr";
import { getShortAddress, truncateText } from "../lib/utils";

export const HodlComment = ({ comment, color = "secondary", sx = {} }) => {
    const router = useRouter();

    const selected = router?.query?.comment == comment.id;

    const { data: profileNickname } = useSWR(comment.subject ? [`/api/profile/nickname`, comment.subject] : null,
        (url, query) => axios.get(`${url}?address=${query}`).then(r => r.data.nickname))

    return (
        <Box
            display="flex"
            alignItems="start"
            gap={1}
            paddingY={1}
            sx={{ background: selected ? yellow[100] : 'none', ...sx }}
            id={`hodl-comments-${comment.id}`}
        >
            <ProfileAvatar profileAddress={comment.subject} size="small" showNickname={false} />
            <Box display="flex" flexDirection="column">
                <Box display="flex" flexDirection="column" flexWrap="wrap">
                    {
                        profileNickname ?
                            <Typography sx={{ color: theme => theme.palette[color].light }}>{truncateText(profileNickname, 20)}</Typography> :
                            <Tooltip title={comment.subject}>
                                <Typography sx={{ color: theme => theme.palette[color].light }}>{getShortAddress(comment.subject)?.toLowerCase()}</Typography>
                            </Tooltip>
                    }
                    <Typography>
                        {comment.comment}
                    </Typography>
                </Box>
                <Typography sx={{ fontSize: 10, color: "#999" }}>{comment.timestamp && formatDistance(new Date(comment.timestamp), new Date(), { addSuffix: false })}</Typography>
            </Box>
        </Box>
    );
};
