import { useRouter } from "next/router";
import { KeyboardBackspaceIcon } from "../icons/KeyboardBackspaceIcon";
import { useTheme } from "@mui/material/styles";
import { CommentsContext } from "../../contexts/CommentsContext";
import { useContext } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

export const HodlCommentsBoxHeader = ({ }) => {
    const theme = useTheme();
    const router = useRouter();

    const { oldTopLevel, setOldTopLevel, setTopLevel, fullscreen, setFullscreen } = useContext(CommentsContext);

    // if (!oldTopLevel?.length) {
    //     return null;
    // }

    return (<>
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
                paddingY: 0.25,
                paddingX: 1,
                borderBottom: `1px solid #eee`
            }}>
            {Boolean(oldTopLevel?.length) ?
                <IconButton
                    onClick={() => {
                        setTopLevel(oldTopLevel[oldTopLevel.length - 1]);
                        setOldTopLevel(old => old.slice(0, -1))
                        router.back();
                    }}
                >
                    <KeyboardBackspaceIcon
                        size={14}
                        fill={theme.palette.secondary.main}

                    />
                </IconButton>
                : <div></div>
            }
            {fullscreen ?
                <IconButton
                    onClick={() => setFullscreen(false)}
                >
                    <FullscreenExitIcon
                        sx={{ fontSize: 14 }}
                        fill={theme.palette.secondary.main}

                    />
                </IconButton> :
                <IconButton
                    onClick={() => setFullscreen(true)}
                >
                    <FullscreenIcon
                        sx={{ fontSize: 14 }}
                        fill={theme.palette.secondary.main}

                    />
                </IconButton>
            }
        </Box>
    </>)
}