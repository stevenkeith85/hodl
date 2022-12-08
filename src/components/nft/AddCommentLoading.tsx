
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import theme from "../../theme";
import Skeleton from "@mui/material/Skeleton";

export const AddCommentLoading = ({
}) => {

    return (

        <div
            style={{
                display: "flex",
                alignItems: "center",
                marginTop: 0
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    flexGrow: 1,
                    gap: theme.spacing(1)
                }} >
                <Box
                    display="flex"
                    flexDirection="column"
                    gap={0}
                    sx={{
                        paddingTop: 2,
                        marginTop: 2,
                        borderTop: `1px solid #ddd`,
                    }}
                >
                    <div style={{ visibility: 'hidden', height: '34px' }}></div>
                </Box>
                <Box display="flex" justifyContent="right" alignItems="center" gap={2}>
                    <Skeleton variant="text" animation="wave">
                        <Typography sx={{ fontSize: 10, paddingLeft: 0.75 }}>0 / 400</Typography>
                    </Skeleton>
                    <Skeleton variant="rounded" animation="wave">
                        <Button type="submit">comment</Button>
                    </Skeleton>
                </Box>
            </div>
        </div>
    )
}