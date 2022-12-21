
import Typography from "@mui/material/Typography";
import { HodlScrollBox } from "../HodlScrollBox";

export const RankingListLoading = ({ text, followButton=true, titleSize=16, height=325, size=60, fontSize=14, titleMargin=3 }) => (<div>
    <HodlScrollBox 
            height={height}
            title={<Typography
                variant='h2'
                color="primary"
                sx={{
                    fontFamily: theme => theme.logo.fontFamily,
                    marginBottom: titleMargin,
                    padding: 0,
                    fontSize: titleSize
                }}>
                {text}
            </Typography>
            }>
        </HodlScrollBox>
</div>)