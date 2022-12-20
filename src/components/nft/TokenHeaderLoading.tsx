import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from '@mui/material/Tab';

import { DataObjectIcon } from '../icons/DataObjectIcon';
import { InsightsIcon } from '../icons/InsightsIcon';
import { ForumIcon } from "../icons/ForumIcon";

import { UserAvatarAndHandleBodyLoading } from "../avatar/UserAvatarAndHandleBodyLoading";

export default function TokenHeader({}) {

    return (
        <Box
            sx={{
                marginY: {
                    xs: 1
                }
            }}>
            <Stack
                spacing={1}
                direction="row"
                sx={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                <Box
                    display="flex"
                    gap={1}
                    alignItems="center"
                >
                    <UserAvatarAndHandleBodyLoading size={50} handle={true} />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'start',
                        marginBottom: 2
                    }}>
                    <Tabs
                        textColor="secondary"
                        indicatorColor="secondary"
                    >
                        <Tab key={0} value={0} icon={
                            <ForumIcon size={16} />
                        }
                            sx={{
                                minWidth: 0,
                                padding: 2,
                                margin: 0
                            }}
                        />
                        <Tab key={1} value={1} icon={
                            <InsightsIcon size={16} />}
                            sx={{
                                minWidth: 0,
                                padding: 2,
                                margin: 0
                            }}
                        />
                        <Tab key={2} value={2}
                            icon={<DataObjectIcon size={16} />}
                            sx={{
                                minWidth: 0,
                                padding: 2,
                                margin: 0
                            }} />
                    </Tabs>
                </Box>
            </Stack>
        </Box>
    )
}