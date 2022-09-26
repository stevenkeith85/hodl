import { Typography, Stack, Tooltip, Link, Box } from "@mui/material";
import { cidToGatewayUrl } from "../../lib/utils";
import { Nft } from "../../models/Nft";
import { Token } from "../../models/Token";
import { ProfileNameOrAddress } from "../avatar/ProfileNameOrAddress";
import { IpfsTooltip } from "../tooltips/IpfsTooltip";

interface OwnerCreatorCardProps {
    token: Nft;
}

export const OwnerCreatorCard: React.FC<OwnerCreatorCardProps> = ({ token }) => {
    return (
        <Box
            sx={{
                padding: 2,
                border: `1px solid #ddd`,
                borderRadius: 1
            }}>

            <Typography variant="h2" sx={{ marginBottom: 2 }}>
                <Tooltip
                    title={<IpfsTooltip />}
                    placement="right-start"
                    arrow>
                    <span>Author &amp; Hodler</span></Tooltip>
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2}}>
                <Box>
                <Typography>Token Author</Typography>
                <ProfileNameOrAddress
                    profileAddress={token?.creator}
                    color={"primary"}
                    fontSize="16px"
                />
                </Box>
                <Box>
                <Typography>Token Hodler</Typography>
                <ProfileNameOrAddress
                    profileAddress={token?.owner}
                    color={"primary"}
                    fontSize="16px"
                />
                </Box>
            </Box>
        </Box>
    )
}