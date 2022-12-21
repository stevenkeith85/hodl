import { useState } from "react";

import dynamic from 'next/dynamic';

import { grey } from "@mui/material/colors";

import IconButton from "@mui/material/IconButton";
import { ShareIcon } from '../icons/ShareIcon';
import theme from "../../theme";

const Likes = dynamic(
  () => import('../Likes').then(mod => mod.Likes),
  {
      ssr: true,
      loading: () => null
  }
);

const Comments = dynamic(
  () => import('../comments/Comments').then(mod => mod.Comments),
  {
      ssr: true,
      loading: () => null
  }
);

const HodlShareMenu = dynamic(
  () => import('../HodlShareMenu').then(mod => mod.HodlShareMenu),
  {
    ssr: true,
    loading: () => null
  }
);

export default function TokenActionBox({
  nft,
  popUp = false,
  prefetchedLikeCount = null,
  prefetchedCommentCount = null
}) {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing(1.5)
        }}
      >
        <Likes
          sx={{
            color: theme => theme.palette.secondary.main,
            '.MuiTypography-body1': { color: '#666' }
          }}
          id={nft.id}
          object="token"
          fontSize={12}
          size={20}
          prefetchedLikeCount={prefetchedLikeCount}
        />
        <Comments
          fontSize={12}
          size={20}
          nft={nft}
          popUp={popUp}
          sx={{ color: '#333', paddingRight: 0 }}
          prefetchedCommentCount={prefetchedCommentCount}
        />
      </div>
      <IconButton
        className="shareMenu"
        onClick={handleClick}
        size="small"
        sx={{
          padding: 0,
          lineHeight: 0,
        }}
      >
        <ShareIcon size={20} fill={grey[600]} />
      </IconButton>
      <HodlShareMenu
        relativeUrl={'/nft/' + nft?.id}
        anchorEl={anchorEl}
        handleClose={handleClose}
        open={open}
      />
    </div>
  )
}