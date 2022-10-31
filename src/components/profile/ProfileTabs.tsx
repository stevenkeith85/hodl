import Badge from "@mui/material/Badge";
import Skeleton from "@mui/material/Skeleton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Link from "next/link";

import humanize from "humanize-plus";

export const ProfileTabs = ({
    owner,
    value,
    setValue,
    hodlingCount,
    listedCount,
    followingCount,
    followersCount
  }) => {
    return (
      <Tabs
        value={value}
        textColor="secondary"
        indicatorColor="secondary"
        sx={{
          width: '100%'
        }}
      >

          <Tab
            component="span"
            onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
              setValue(0);
            }}
            key={0}
            value={0}
            label="Hodling"
            icon={<Badge
              sx={{
                p: {
                  xs: '6px 1px',
                  sm: '6px 3px',
                }
              }}
              showZero
              max={Number.MAX_SAFE_INTEGER}
              badgeContent={
                hodlingCount === null ?
                  <Skeleton width={10} variant="text" animation="wave" /> :
                  humanize.compactInteger(hodlingCount, 1)
              }
            >
            </Badge>
            }
            iconPosition="end"
            sx={{
              minWidth: 0,
              width: {
                xs: '25%',
                sm: '120px',
              },
              paddingX: {
                xs: 1.75,
                sm: 2
              },
              paddingY: 2,
              margin: 0
            }}
          />
          <Tab
            component="span"
            onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
              setValue(1);
            }}
            key={1}
            value={1}
            label="Listed"
            icon={<Badge
              sx={{
                p: {
                  xs: '6px 1px',
                  sm: '6px 3px',
                }
              }}
              showZero
              max={Number.MAX_SAFE_INTEGER}
              badgeContent={
                listedCount === null ?
                  <Skeleton width={10} variant="text" animation="wave" /> :
                  humanize.compactInteger(listedCount, 1)
              }
            >
            </Badge>
            }
            iconPosition="end"
            sx={{
              minWidth: 0,
              width: {
                xs: '25%',
                sm: '120px',
              },
              paddingX: {
                xs: 1.75,
                sm: 2
              },
              paddingY: 2,
              margin: 0
            }}
          />
          <Tab
            component="span"
            onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
              setValue(2);
            }}
            key={2}
            value={2}
            label="Following"
            icon={<Badge
              sx={{
                p: {
                  xs: '6px 1px',
                  sm: '6px 3px',
                }
              }}
              showZero
              max={Number.MAX_SAFE_INTEGER}
              badgeContent={humanize.compactInteger(followingCount, 1)}
            >
            </Badge>}
            iconPosition="end"
            sx={{
              minWidth: 0,
              width: {
                xs: '25%',
                sm: '120px',
              },
              paddingX: {
                xs: 1.75,
                sm: 2
              },
              paddingY: 2,
              margin: 0
            }}
          />
          <Tab
            component="span"
            onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
              setValue(3);
            }}
            key={3}
            value={3}
            label="Followers"
            icon={
              <Badge
                sx={{
                  p: {
                    xs: '6px 1px',
                    sm: '6px 3px',
                  }
                }}
                showZero
                max={Number.MAX_SAFE_INTEGER}
                badgeContent={humanize.compactInteger(followersCount, 1)}
              >
              </Badge>
            }
            iconPosition="end"
            sx={{
              minWidth: 0,
              width: {
                xs: '25%',
                sm: '120px',
              },
              paddingX: {
                xs: 1.75,
                sm: 2
              },
              paddingY: 2,
              margin: 0
            }}
          />
      </Tabs>
    )
  }
