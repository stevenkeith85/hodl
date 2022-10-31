import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

export const RankingListLoading = ({ text }) => (<div>
    <Skeleton variant="text" animation="wave" >
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
    </Skeleton>
    <Skeleton variant="rounded" animation="wave" height={250}></Skeleton>
</div>)