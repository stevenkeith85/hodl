import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";


export default function PrivateHomePageSwitch({ viewSidebar, setViewSidebar }) {
    return (
        <Box
            sx={{
                display: {
                    xs: 'flex',
                    md: 'none'
                },
                justifyContent: 'right',
            }}>
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                    marginTop: 1,
                    marginX: {
                        xs: 0,
                        sm: 4
                    }
                }}
            >
                <Switch
                    checked={viewSidebar}
                    onChange={(e) => {
                        setViewSidebar(old => !old);
                    }
                    }
                />
            </Box>
        </Box>
    )
}