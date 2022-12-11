import { UserLinksList } from '../profile/UserLinksList';
import { useContext } from 'react';
import { RankingsContext } from '../../contexts/RankingsContext';
import { HodlScrollBox } from '../HodlScrollBox';
import Typography from '@mui/material/Typography';

export const NewUsers = ({ followButton = true, titleSize = 16, height = 325, size=44, fontSize=14, titleMargin=2 }) => {
    const { limit, newUsers } = useContext(RankingsContext);

    return (
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
                New Polygon NFT Creators
            </Typography>
            }>
            <UserLinksList swr={newUsers} limit={limit} width={`100%`} followButton={followButton} size={size} fontSize={fontSize}/>
        </HodlScrollBox>
    )
}
