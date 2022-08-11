import { Button } from "@mui/material";
import { useContext } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { useFollow } from "../../hooks/useFollow";
import { useUser } from "../../hooks/useUser";
import { User, UserViewModel } from "../../models/User";

interface FollowButtonProps {
    profileAddress: string;
    variant?: 'text' | 'outlined' | 'contained';
}

export const FollowButton : React.FC<FollowButtonProps> = ({ profileAddress, variant ="contained" }) => {
    const { address } = useContext(WalletContext); // TODO: We probably just want to store the logged in UserViewModal in the context
    const profileUserSWR = useUser(profileAddress);

    
    const [
        follow, 
    ] = useFollow(profileAddress);

    if (address === profileAddress) {
        return null; // we 
    }
    if (!profileUserSWR.data) {
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
            {profileUserSWR.data.followedByViewer ? 'following' : 'follow'}
        </Button>
    )
}
