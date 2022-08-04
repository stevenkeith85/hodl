import { Typography, Box, Badge, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import { Forum } from "@mui/icons-material";
import { useContext } from "react";
import { NftContext } from "../../contexts/NftContext";

export const HodlCommentsBoxHeader = ({ 
    object, 
    countSWR, 
    setTopLevel
}) => {
    const { nft } = useContext(NftContext);
    const router = useRouter();
    
    return (
        <Box
            display="flex"
            justifyContent="space-between"
        >
            {object === "token" ?
                <Typography
                    variant="h2"
                    sx={{ marginBottom: 2 }}
                >
                    Comments <Badge sx={{ p: '6px 3px' }} showZero badgeContent={countSWR.data} max={1000}></Badge>
                </Typography> :
                (<><Typography
                    variant="h3"
                    sx={{ marginBottom: 2 }}
                >
                    Single Comment Thread
                </Typography>
                    <Tooltip title="View All Comments">
                        <Forum
                            sx={{ cursor: 'pointer', color: '#999' }}
                            fontSize="inherit"
                            onClick={() => {
                                setTopLevel({ objectId: nft.id, object: "token" });
                                    router.push({
                                        pathname: window.location.pathname,
                                    }, undefined, { shallow: true });

                            }} />
                    </Tooltip>
                </>)
            }
        </Box>
    )
}