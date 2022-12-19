import { useState } from "react";

import Box from '@mui/material/Box'

import { CopyText } from '../CopyText'
import Typography from '@mui/material/Typography'
import { getShortAddress } from "../../lib/getShortAddress";

import { ShareIcon } from '../icons/ShareIcon';
import { grey } from "@mui/material/colors";

import dynamic from 'next/dynamic'

import { ProfileNameOrAddress } from '../avatar/ProfileNameOrAddress'
import { UserAvatarAndHandle } from '../avatar/UserAvatarAndHandle'


const FollowButton = dynamic(
  () => import('./FollowButton').then(mod => mod.FollowButton),
  {
    ssr: false,
    loading: () => null
  }
);

const HodlShareMenu = dynamic(
  () => import('../HodlShareMenu').then((module) => module.HodlShareMenu),
  {
    ssr: false,
    loading: () => null
  }
);


export const ProfileHeader = ({
  owner
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}>
      <Box
        display="flex"
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Box
          display="flex"
          flexDirection={"row"}
          alignItems={"center"}
        >
          {/* avatar */}
          <Box>
            <Box sx={{
              display: {
                xs: 'block',
                sm: 'none'
              }
            }}>
              <UserAvatarAndHandle
                address={owner.address}
                fallbackData={owner}
                size={90}
                fontSize={20}
                handle={false}
              />
            </Box>
            <Box sx={{
              display: {
                xs: 'none',
                sm: 'block'
              }
            }}>
              <UserAvatarAndHandle
                address={owner.address}
                fallbackData={owner}
                size={120}
                fontSize={24}
                handle={false}
              />
            </Box>
          </Box>
          {/* name and address */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              margin: {
                xs: 3,
                sm: 4
              }
            }}>
            <ProfileNameOrAddress
              profileAddress={owner.address}
              fallbackData={owner}
              sx={{
                span: {
                  fontSize: {
                    xs: 20,
                    sm: 24
                  }
                }
              }}
            />
            <CopyText text={owner.address}>
              <Typography
                sx={{
                  fontSize: {
                    xs: 14,
                    sm: 14
                  },
                  color: theme => theme.palette.text.secondary
                }}>
                {getShortAddress(owner.address)}
              </Typography>
            </CopyText>
          </Box>
        </Box>
        {/* share */}
        <Box
          display="flex"
          alignItems={"center"}
          gap={2}
        >
          <Box sx={{
            display: {
              xs: 'none',
              sm: 'flex'
            },
          }}>
            <FollowButton profileAddress={owner.address} variant="outlined" />
          </Box>
          <div
            className="shareMenu"
            onClick={handleClick}
            style={{
              cursor: 'pointer',
              padding: 0,
              lineHeight: 0,
            }}
          >
            <ShareIcon size={20} fill={grey[800]} />
          </div>
          {
            open &&
            <HodlShareMenu
              relativeUrl={'/profile/' + owner.nickname || owner.address}
              anchorEl={anchorEl}
              handleClose={handleClose}
              open={open}
            />
          }
        </Box>
      </Box>
      <Box
        sx={{
          display: {
            xs: 'flex',
            sm: 'none'
          },
          alignItems: 'center',
          justifyContent: 'center'
        }}

      >
        <FollowButton
          profileAddress={owner.address}
          variant="outlined"
          sx={{
            marginTop: 2,
            maxWidth: '100%',
            width: '100%',
            height: '40px'
          }}
        />
      </Box>
    </Box>
  )
}
