
import Button from "@mui/material/Button";
import { useContext } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { useFollow } from "../../hooks/useFollow";
import { useUser } from "../../hooks/useUser";
import { UserViewModel } from "../../models/User";

interface FollowButtonProps {
    profileAddress: string;
    variant?: 'text' | 'outlined' | 'contained';
    sx?: object
}

export const FollowButton: React.FC<FollowButtonProps> = ({ profileAddress, variant = "contained", sx = {} }) => {
    const { address } = useContext(WalletContext); // the logged in user
    
    const profileUserSWR = useUser(profileAddress, null, address); // this is the user the follow / unfollow action will operate on

    const [
        follow,
    ] = useFollow(profileAddress);

    if (!address || address === profileAddress) {
        return null;
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
            sx={{
                ...sx
            }}
        >
            {profileUserSWR.data.followedByViewer ? 'following' : 'follow'}
        </Button>
    )
}
