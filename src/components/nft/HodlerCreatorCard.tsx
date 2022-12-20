import Box from "@mui/material/Box";
import { useMutableToken } from "../../hooks/useMutableToken";
import { UserAvatarAndHandle } from "../avatar/UserAvatarAndHandle";


export const HodlerCreatorCard = ({
    prefetchedToken,
    prefetchedMutableToken
}) => {
    const { data: mutableToken } = useMutableToken(prefetchedToken.id, prefetchedMutableToken);
    return (
        <Box
            sx={{
                padding: 2,
                border: `1px solid #eee`,
                borderRadius: 1,
                background: 'white'
            }}>
            <Box
                sx={{
                    display: 'grid',
                    columnGap: 2,
                    rowGap: 2,
                    gridTemplateColumns: '1fr 1fr',
                    alignItems: 'center'
                }}
            >

                <Box
                    sx={{
                        fontSize: 14,
                        color: theme => theme.palette.text.secondary
                    }}>
                    Creator
                </Box>
                <UserAvatarAndHandle
                    address={prefetchedToken.creator}
                    color={"primary"}
                />
                <Box
                    sx={{
                        fontSize: 14,
                        color: theme => theme.palette.text.secondary
                    }}>
                    Hodler
                </Box>
                <UserAvatarAndHandle
                    address={mutableToken?.hodler}
                    color={"primary"}
                />
            </Box>
        </Box >
    )
}
