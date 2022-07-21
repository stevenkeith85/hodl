import { Box, Button } from "@mui/material";
import { useContext } from "react";
import { FeedContext } from "../../contexts/FeedContext";
import { WalletContext } from "../../contexts/WalletContext";
import { useFollow } from "../../hooks/useFollow";

interface FollowButtonProps {
    profileAddress: string;
    variant?: 'text' | 'outlined' | 'contained';
}

export const FollowButton : React.FC<FollowButtonProps> = ({ profileAddress, variant ="contained" }) => {
    const { address } = useContext(WalletContext);
    const { feed } = useContext(FeedContext);
    
    const [follow, isFollowing] = useFollow(profileAddress, feed);

    const ownProfile = address === profileAddress;

    if (!address) {
        return null;
    }

    if (ownProfile) {
        return null;
    }
    
    return (
        <Button
            variant={variant}
            color="secondary"
            onClick={ // @ts-ignore
                async () => await follow()
            }
        >
            {isFollowing ? 'unfollow' : 'follow'}
        </Button>
    )
}