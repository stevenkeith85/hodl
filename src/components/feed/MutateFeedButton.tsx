import RefreshIcon from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import { useContext } from 'react';
import { FeedContext } from '../../contexts/FeedContext';

export const MutateFeedButton = ({ setMutateButtonVisible}) => {
    const { feed } = useContext(FeedContext);

    return (
        <Box sx={{
            position: 'fixed',
            zIndex: 300,
            width: 'calc(100% - 32px)',
            maxWidth: '530px',
            top: `80px`,
        }}>
            <div>
            <Fab
                size="small"
                color="secondary"
                variant='circular'
                sx={{
                    opacity: 0.6,
                    position: 'absolute',
                    right: 0,
                    left: 0,
                    marginX: 'auto',
                    '&:hover': {
                        opacity: 1
                    }

                }}
                onClick={() => {
                    feed.mutate();
                    setMutateButtonVisible(false);
                }}>
                <RefreshIcon />
            </Fab>
            </div>
        </Box>
    )
}