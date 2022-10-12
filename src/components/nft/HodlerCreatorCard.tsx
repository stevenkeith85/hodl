import { Typography, Tooltip, Box } from "@mui/material";
import { ProfileNameOrAddress } from "../avatar/ProfileNameOrAddress";
import { IpfsTooltip } from "../tooltips/IpfsTooltip";

interface HodlerCreatorCardProps {
    hodler: string;
    creator: string;
}

export const HodlerCreatorCard: React.FC<HodlerCreatorCardProps> = ({ hodler, creator }) => {
    return (
        <Box
            sx={{
                padding: 2,
                border: `1px solid #ddd`,
                background: 'white'
            }}>

            <Typography variant="h2" sx={{ marginBottom: 2 }}>
                <Tooltip
                    title={<IpfsTooltip />}
                    placement="right-start"
                    arrow>
                    <span>Author &amp; Hodler</span></Tooltip>
            </Typography>

            <Box sx={{ display: 'grid', gap: 2}}>
                <Box>
                <Typography>Author</Typography>
                <ProfileNameOrAddress
                    profileAddress={creator}
                    color={"primary"}
                    fontSize="14px"
                />
                </Box>
                <Box>
                <Typography>Hodler</Typography>
                <ProfileNameOrAddress
                    profileAddress={hodler}
                    color={"primary"}
                    fontSize="14px"
                />
                </Box>
            </Box>
        </Box>
    )
}