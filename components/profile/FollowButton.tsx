import { Box, Button } from "@mui/material";
import { useContext } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { useFollow } from "../../hooks/useFollow";
import theme from "../../theme";

export const FollowButton = ({ profileAddress }) => {
    const { address } = useContext(WalletContext);
    const [follow, isFollowing] = useFollow(profileAddress);

    const ownProfile = address === profileAddress;

    if (ownProfile) {
        return null;
    }
    
    return (
        <Button
            variant="contained"
            sx={{
                padding: '5px 20px',
                // fontWeight: 600,
                backgroundColor: theme => theme.palette.secondary.light, 
                color: theme => theme.palette.secondary.contrastText,
                '&:hover': {
                    backgroundColor: theme => theme.palette.secondary.main, 
                color: theme => theme.palette.secondary.contrastText,
                }
            }}
            onClick={ // @ts-ignore
                async () => await follow()
            }
        >
            {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
    )
}