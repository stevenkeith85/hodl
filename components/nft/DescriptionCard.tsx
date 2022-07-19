import { Box, Card, CardContent, Typography } from "@mui/material";

export const DescriptionCard = ({ nft }) => (
    <Card variant="outlined">
        <CardContent>
            <Typography variant="h2" color="primary" sx={{ marginBottom: 2 }}>Description</Typography>
            <Box sx={{
                whiteSpace: 'pre-line',
                maxHeight: '250px',
                overflow: 'auto',
                position: 'relative'
            }}>
                <Typography>{nft?.description || ""}</Typography>
            </Box>

        </CardContent>
    </Card>
)