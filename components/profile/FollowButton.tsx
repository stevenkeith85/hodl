import { Box, Button } from "@mui/material";
import { useContext } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { useFollow } from "../../hooks/useFollow";

interface FollowButtonProps {
    profileAddress: string;
    variant?: 'text' | 'outlined' | 'contained';
}

export const FollowButton : React.FC<FollowButtonProps> = ({ profileAddress, variant ="contained" }) => {
    const { address } = useContext(WalletContext);
    const [follow, isFollowing] = useFollow(profileAddress);

    const ownProfile = address === profileAddress;

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
            {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
    )
}