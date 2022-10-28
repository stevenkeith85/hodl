import DataObjectIcon from '@mui/icons-material/DataObject';
import InsightsIcon from '@mui/icons-material/Insights';
import ForumIcon from '@mui/icons-material/Forum';

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import { UserAvatarAndHandle } from '../avatar/UserAvatarAndHandle';
import Tab from '@mui/material/Tab';

import router from "next/router";


export default function TokenHeader({
    mutableToken,
    value,
    setValue,
    nft }) {

    return (
        <Box
            sx={{
                marginX: {
                    xs: 0
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
                    <UserAvatarAndHandle
                        address={mutableToken?.hodler}
                        size={50}
                        fontSize={16}
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'start',
                        marginBottom: 2
                    }}>
                    <Tabs
                        value={value}
                        onChange={(e, v) => {
                            setValue(v);

                            router.push(
                                {
                                    pathname: '/nft/[tokenId]',
                                    query: {
                                        tokenId: nft.id,
                                        tab: v
                                    }
                                },
                                undefined,
                                {
                                    shallow: true
                                }
                            )
                        }}
                        textColor="secondary"
                        indicatorColor="secondary"
                    >
                        <Tab key={0} value={0} icon={
                            <ForumIcon
                                sx={{
                                    fontSize: {
                                        xs: 16,
                                    }
                                }}
                            />
                        }
                            sx={{
                                minWidth: 0,
                                padding: 2,
                                margin: 0
                            }}
                        />
                        <Tab key={1} value={1} icon={
                            <InsightsIcon
                                sx={{
                                    fontSize: {
                                        xs: 16,
                                    },
                                }}
                            />}
                            sx={{
                                minWidth: 0,
                                padding: 2,
                                margin: 0
                            }}
                        />
                        <Tab key={2} value={2}
                            icon={
                                <DataObjectIcon
                                    sx={{
                                        fontSize: {
                                            xs: 16,
                                        }
                                    }}
                                />}
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