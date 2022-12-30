import { useRouter } from "next/router";
import { KeyboardBackspaceIcon } from "../icons/KeyboardBackspaceIcon";
import { useTheme } from "@mui/material/styles";
import { CommentsContext } from "../../contexts/CommentsContext";
import { useContext } from "react";
import Box from "@mui/material/Box";


export const HodlCommentsBoxHeader= ({}) => {
    const theme = useTheme();
    const router = useRouter();

    const { oldTopLevel, setOldTopLevel, setTopLevel} = useContext(CommentsContext);

    if (!oldTopLevel?.length) {
        return null;
    }

    return (<>
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                paddingTop: 2,
                paddingX: 2,
                cursor: 'pointer'
            }}
            onClick={() => {
                setTopLevel(oldTopLevel[oldTopLevel.length - 1]);
                setOldTopLevel(old => old.slice(0, -1))
                router.back();
            }}>
            <KeyboardBackspaceIcon size={14} fill={theme.palette.secondary.main} />
        </Box>
    </>)
}