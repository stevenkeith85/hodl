import { Box, Typography } from "@mui/material"
import { truncateText } from "../lib/utils"
import { ProfileNameOrAddress } from "./avatar/ProfileNameOrAddress"
import { UserAvatarAndHandle } from "./avatar/UserAvatarAndHandle"
import { HodlAudio } from "./HodlAudio"

export const HodlAudioBox = ({
    token,
    audio = true, // show the audioplayer
    size = 60,
    width = "100%",
    minHeight = 324 // we use 575 as the feed width, so 324 makes this 16:9 (roughly). We can override for other places if we want
}) => {
    return (
        <Box
            className="hodlAudioBox"
            sx={{ width: '100%' }}
        >
            <Box sx={{
                position: "relative",
                width,
                height: 0,
                paddingTop: `calc(min(100%, ${minHeight}px))`,
                boxSizing: 'border-box',
                background: theme => theme.palette.primary.light,
                marginBottom: 2
            }}>
                <Box sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    padding: 2,
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    flexDirection: "column",
                    justifyContent: "center",
                    color: "white",
                }}>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2
                        }}
                    >
                        <UserAvatarAndHandle
                            address={token.creator}
                            size={size}
                            handle={false}
                        />
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                color: "white",
                                gap: 0.5
                            }}
                        >
                            <Typography sx={{ fontSize: 20 }} >"{truncateText(token.name, 50)}"</Typography>
                            <Typography sx={{ fontSize: 18, color: 'white' }} >
                                <ProfileNameOrAddress
                                    profileAddress={token.creator}
                                    fontSize="18px"
                                    color="inherit"
                                />
                            </Typography>

                        </Box>
                    </Box>
                </Box>
            </Box>
            {audio && <Box>
                <HodlAudio cid={token?.image} />
            </Box>}
        </Box>
    )
}