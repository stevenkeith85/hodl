import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

export const RankingListLoading = ({ text }) => (<div>
        <Typography
            variant='h2'
            color="primary"
            sx={{
                fontFamily: theme => theme.logo.fontFamily,
                marginBottom: 2,
                padding: 0,
                fontSize: 16
            }}>
            {text}
        </Typography>
    <Skeleton variant="rounded" animation="wave" height={325}></Skeleton>
</div>)