import { Button } from "@mui/material";
import { useContext } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { useFollow } from "../../hooks/useFollow";

export const FollowButton = ({ profileAddress }) => {
    const { address } = useContext(WalletContext);
    const [follow, isFollowing] = useFollow(profileAddress);

    const ownProfile = address === profileAddress;

    if (ownProfile) {
        return null;
    }
    
    return (
        <Button
            onClick={ // @ts-ignore
                async () => await follow()
            }
        >
            {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
    )
}