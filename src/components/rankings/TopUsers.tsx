import { RankingsContext } from '../../contexts/RankingsContext';
import { useContext } from 'react';
import { UserLinksList } from '../profile/UserLinksList';
import { HodlScrollBox } from '../HodlScrollBox';
import Typography from '@mui/material/Typography';

export const TopUsers = ({ followButton=true, titleSize=16, height=325, size=60, fontSize=14, titleMargin=3 }) => {
    const { limit, mostFollowed: rankings } = useContext(RankingsContext);

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
                Top Polygon NFT Creators
            </Typography>
            }>
            <UserLinksList swr={rankings} limit={limit} width={`100%`} followButton={followButton} size={size} fontSize={fontSize}/>
        </HodlScrollBox>
    )
}
