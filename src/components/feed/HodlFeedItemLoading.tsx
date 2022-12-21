import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import TokenActionBoxLoading from "../nft/TokenActionBoxLoading";
import Skeleton from "@mui/material/Skeleton";
import { memo } from "react";


export const HodlFeedItemLoading = memo(({ }) => {

    return (
        <Box sx={{ paddingBottom: 3 }}>
            <Box
                className={'feedItem'}
                display="flex"
                flexDirection="column"
                sx={{
                    gap: 2,
                    borderRadius: 1,
                    padding:
                    {
                        xs: 1.5,
                        sm: 2
                    },
                    boxShadow: '1px 1px 8px #eee',
                    background: 'white'
                }
                }
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    sx={{ width: '100%' }}
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1.5}
                    >

                        <Skeleton variant="circular" animation="wave" width={44} height={44} />
                        <Box
                            flexGrow={1}
                            sx={{
                                cursor: 'pointer',
                                textDecoration: 'none'
                            }}>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                width="100%"
                                alignItems="center"
                            >
                                <Box display="flex" flexDirection="column" component="span">
                                    <Skeleton variant="text" width={50} height={14}></Skeleton>
                                    <Skeleton variant="text" width={25} height={12}></Skeleton>
                                </Box>
                                <Skeleton>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            textAlign: 'right',
                                            fontFamily: theme => theme.logo.fontFamily,
                                            color: theme => theme.palette.secondary.main
                                        }}>
                                        <Typography>new</Typography>
                                    </Box>
                                </Skeleton>
                            </Box>
                        </Box>
                    </Box>
                    {
                        <Box
                            sx={{
                                height: '100%',
                                lineHeight: 0,
                                cursor: 'pointer',
                                marginX: {
                                    xs: -1.5,
                                    sm: -2
                                }
                            }}>
                            <Skeleton variant="rectangular" animation="wave" width="100%" height={300} />
                        </Box>
                    }
                </Box>
                <div style={{ height: '20px' }}>
                    <TokenActionBoxLoading />
                </div>
                <div>
                    <Skeleton>
                        <Typography
                            sx={{
                                fontWeight: 600
                            }}>
                            Token Name
                        </Typography>
                    </Skeleton>
                    <Skeleton>
                        <Typography>
                            foo bar baz foo bar baz foo bar baz foo bar baz
                        </Typography>
                    </Skeleton>
                </div>
            </Box>
        </Box>
    )
}
)

HodlFeedItemLoading.displayName = "HodlFeedItemLoading"