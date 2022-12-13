import { HodlShareMenu } from './HodlShareMenu'
import { ShareIcon } from './icons/ShareIcon';
import { useState } from "react";
import Button from '@mui/material/Button';


export const HodlShareButton = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (<>
    <Button
      variant="contained"
      color="secondary"
      className="shareMenu"
      onClick={handleClick}
      endIcon={<ShareIcon size={18} fill={'white'} />}
      sx={{ paddingY: 1, paddingX: 2, fontWeight: 600}}
    >
      Share 
    </Button>
    {
      open &&
      <HodlShareMenu
        relativeUrl={window.location.pathname}
        anchorEl={anchorEl}
        handleClose={handleClose}
        open={open}
      />
    }
  </>)
}