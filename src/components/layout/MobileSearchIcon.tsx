import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import { useTheme } from '@mui/material/styles';

import { CloseIcon } from '../icons/CloseIcon';
import { SearchIcon } from '../icons/SearchIcon';


export const MobileSearchIcon = ({ mobileSearchOpen, setMobileSearchOpen, setShowNotifications }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                lineHeight: 0,
            }}
        >
            {mobileSearchOpen ?
                <IconButton
                    sx={{
                        width: 44,
                        height: 44
                    }}
                    color="inherit"
                    onClick={() => setMobileSearchOpen(false)}
                >
                    <CloseIcon size={22} fill={theme.palette.primary.main} />
                </IconButton>
                :
                <IconButton
                    sx={{
                        width: 44,
                        height: 44,
                    }}
                    color="inherit"
                    onClick={
                        () => {
                            setMobileSearchOpen(true);
                            setShowNotifications(false);
                        }}
                >
                    <SearchIcon size={22} fill={theme.palette.primary.main} />
                </IconButton>
            }
        </Box>
    )
}
