import { Card, CardContent, Typography } from "@mui/material";

export const DescriptionCard = ({nft}) => (
    <Card variant="outlined">
        <CardContent sx={{ whiteSpace: 'pre-line', maxHeight: 500, overflowY: 'auto'}}>
            <Typography sx={{ marginBottom: 2 }}>Description</Typography>
            <Typography>{nft?.description || ""}</Typography>
        </CardContent>
    </Card>
)