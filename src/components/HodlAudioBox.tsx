import Box from "@mui/material/Box"
import { useTheme } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import useMediaQuery from "@mui/material/useMediaQuery"
import { truncateText } from "../lib/truncateText"

import { Token } from "../models/Token"

import { ProfileNameOrAddress } from "./avatar/ProfileNameOrAddress"
import { UserAvatarAndHandle } from "./avatar/UserAvatarAndHandle"

import { HodlAudio } from "./HodlAudio"


interface HodlAudioBoxProps {
    token: Token;
    audio?: boolean;
    size?: number;
    width?: string;
    minHeight?: number;
}

export const HodlAudioBox: React.FC<HodlAudioBoxProps> = ({
    token,
    audio = true, // show the audioplayer
    size = 50,
    width = "100%",
    minHeight = 324 // we use 575 as the feed width, so 324 makes this 16:9 (roughly). We can override for other places if we want
}) => {
    const theme = useTheme();
    const smAndBelow = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box className="hodlAudioBox" sx={{ width: '100%' }}>
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
                            flexDirection: {
                                xs: "column",
                                sm: "row"
                            },
                            gap: 2
                        }}
                    >
                        {!smAndBelow && <UserAvatarAndHandle
                            address={token.creator}
                            size={size}
                            handle={false}
                        />}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                color: "white",
                                gap: 0.5
                            }}
                        >
                            <Typography sx={{
                                fontSize: {
                                    xs: 14,
                                    md: 16
                                }
                            }} >{truncateText(token.name, 50)}</Typography>
                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: 12,
                                        md: 14
                                    },
                                    color: 'white'
                                }} >
                                @<ProfileNameOrAddress
                                    profileAddress={token.creator}
                                    fontSize={ smAndBelow ? '12px' : "14px" }
                                    color="inherit"
                                />
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
            {audio && <div>
                <HodlAudio cid={token?.properties?.asset?.uri} mimeType={token?.properties?.asset?.mimeType} />
            </div>}
        </Box>
    )
}
