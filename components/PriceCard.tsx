import { Card, CardContent, Typography } from "@mui/material";

export const PriceCard = ({nft}) => (
    <Card variant="outlined">
    <CardContent>
       <Typography sx={{ marginBottom: 2 }}>Price</Typography>
       <Typography>{nft?.price || "<Price Not Known>"} Matic</Typography>
    </CardContent>
  </Card>
)