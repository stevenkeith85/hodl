import { Card, CardContent, Typography } from "@mui/material";

export const DescriptionCard = ({nft}) => (
    <Card variant="outlined">
        <CardContent sx={{ whiteSpace: 'pre-line', maxHeight: 300, overflowY: 'auto'}}>
            <Typography variant="h3" sx={{ marginBottom: 2 }}>Description</Typography>
            <Typography>{nft?.description || ""}</Typography>
        </CardContent>
    </Card>
)