import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { getShortAddress } from '../../lib/utils'
import { ProfileNameOrAddress } from '../avatar/ProfileNameOrAddress'
import { UserAvatarAndHandle } from '../avatar/UserAvatarAndHandle'
import { CopyText } from '../CopyText'
import { FollowButton } from './FollowButton'


export const ProfileHeader = ({
    owner
  }) => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Box
          display="flex"
          alignItems={"center"}
        >
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              margin: {
                xs: 2,
                sm: 3
              }
            }}>
            <ProfileNameOrAddress
              profileAddress={owner.address}
              fallbackData={owner}
              sx={{
                fontSize: {
                  xs: 20,
                  sm: 24
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
        <FollowButton profileAddress={owner.address} variant="outlined" />
      </Box>
    )
  }
  