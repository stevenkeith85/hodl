import { useRouter } from "next/router";
import { KeyboardBackspaceIcon } from "../icons/KeyboardBackspaceIcon";
import { useTheme } from "@mui/material/styles";

interface HodlCommentsBoxHeaderProps {
    setTopLevel: any;
    oldTopLevel: any;
    setOldTopLevel: Function;
}

export const HodlCommentsBoxHeader: React.FC<HodlCommentsBoxHeaderProps> = ({
    setTopLevel,
    oldTopLevel,
    setOldTopLevel,
}) => {
    const theme = useTheme();
    const router = useRouter();

    return (<>
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing(1),
                marginBottom: theme.spacing(2),
                cursor: 'pointer'
            }}
            onClick={() => {
                setTopLevel(oldTopLevel[oldTopLevel.length - 1]);
                setOldTopLevel(old => old.slice(0, -1))
                router.back();
            }}>
                <KeyboardBackspaceIcon size={14} fill={theme.palette.secondary.main} />
        </div>
    </>)
}