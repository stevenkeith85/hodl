import Box from "@mui/material/Box";
import { Comments } from "../comments/Comments";
import { HodlShareMenu } from "../HodlShareMenu";
import { Likes } from "../Likes";


export default function TokenActionBox({ nft, popUp=false }) {
    return (<Box
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box gap={1.5} display='flex' alignItems='center'>
        <Likes
          sx={{
            color: theme => theme.palette.secondary.main,
            '.MuiTypography-body1': { color: '#666' }
          }}
          id={nft.id}
          object="token"
          fontSize={12}
          size={20}
        />
        <Comments
          fontSize={12}
          size={20}
          nft={nft}
          popUp={popUp}
          sx={{ color: '#333', paddingRight: 0 }}
        />
      </Box>
      <HodlShareMenu nft={nft} />
    </Box>
    )
  }