import router from "next/router";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from '@mui/material/Tab';

import { DataObjectIcon } from '../icons/DataObjectIcon';
import { InsightsIcon } from '../icons/InsightsIcon';
import { ForumIcon } from "../icons/ForumIcon";
import { useMutableToken } from "../../hooks/useMutableToken";
import { UserAvatarAndHandle } from "../avatar/UserAvatarAndHandle";


export default function TokenHeader({
    prefetchedToken,
    prefetchedMutableToken,
    prefetchedHodler,
    value,
    setValue
}) {

    const { data: mutableToken } = useMutableToken(prefetchedToken.id, prefetchedMutableToken);

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
                    <UserAvatarAndHandle
                        fallbackData={prefetchedHodler}
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
                                        tokenId: prefetchedToken.id,
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
                            <ForumIcon size={16} />
                        }
                            sx={{
                                minWidth: 0,
                                padding: 2,
                                margin: 0
                            }}
                        />
                        <Tab key={1} value={1} icon={
                            <InsightsIcon size={16}/>}
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