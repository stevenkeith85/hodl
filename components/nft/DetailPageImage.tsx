import { Box, Modal } from "@mui/material";
import { HodlVideo } from "../HodlVideo";
import { assetType } from "../../lib/utils";
import { HodlImage } from "../HodlImage";
import { useState } from "react";


export const DetailPageImage = ({ token }) => {
    const [assetModalOpen, setAssetModalOpen] = useState(false);

    return (token &&
        <>
            <Modal open={assetModalOpen} onClose={() => { setAssetModalOpen(false) }}>
                <>
                    {assetType(token) === 'gif' && <HodlVideo
                        sx={{
                            pointerEvents: 'none',
                            justifyContent: 'center',
                            alignItems: 'center',
                            video: {
                                height: '66vh',
                                width: '66vw',
                                objectFit: 'scale-down',
                            }
                        }}
                        cid={token?.image} transformations={token?.filter} gif={true} />}
                    {assetType(token) === 'video' && <HodlVideo
                        sx={{
                            pointerEvents: 'none',
                            justifyContent: 'center',
                            alignItems: 'center',
                            video: {
                                height: '66vh',
                                width: '66vw',
                                objectFit: 'scale-down',
                            }
                        }}

                        cid={token?.image} folder={'video/upload/nfts/'} />}
                    {assetType(token) === 'image' && <HodlImage
                        loading="eager"
                        sx={{
                            pointerEvents: 'none',
                            justifyContent: 'center',
                            alignItems: 'center',
                            img: {
                                height: '66vh',
                                width: '66vw',
                                objectFit: 'scale-down',
                            }
                        }}
                        cid={token?.image} effect={token?.filter} />}
                </>
            </Modal>
            <Box sx={{ cursor: 'pointer'}}>
                <Box onClick={() => setAssetModalOpen(true)}>
                    {
                        assetType(token) === 'gif' && 
                        <HodlVideo cid={token?.image} transformations={token?.filter} gif={true} />
                    }
                </Box>
                <Box onClick={() => setAssetModalOpen(true)}>
                    {
                        assetType(token) === 'image' && 
                        <HodlImage 
                            cid={token?.image} 
                            effect={token?.filter} 
                            // fit="scale-down" 
                            sizes = "(max-width:599px) 600px, (max-width:899px) 900px, 600px"
                        />}
                </Box>
                <Box>
                    {assetType(token) === 'video' && <HodlVideo cid={token?.image} transformations={token?.filter} />}
                </Box>
            </Box>

        </>
    )
}