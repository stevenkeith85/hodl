import { Button } from "@mui/material";
import { useContext, useEffect } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { useFollow } from "../../hooks/useFollow";
import { useSnackbar } from 'notistack';

export const FollowButton = ({ profileAddress }) => {
    const { address } = useContext(WalletContext);
    const { enqueueSnackbar } = useSnackbar();
    const [follow, isFollowing, error, setError] = useFollow(profileAddress);

    const ownProfile = address === profileAddress;

    useEffect(() => {
        if (error !== '') {
            enqueueSnackbar(error, { variant: "error" });
            // @ts-ignore
            setError('');
        }
        // @ts-ignore
    }, [error])

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