import { Box, Modal } from "@mui/material";
import { HodlVideo } from "../HodlVideo";
import { assetType } from "../../lib/utils";
import { HodlImage } from "../HodlImage";
import { useState } from "react";
import { AssetTypes } from "../../models/AssetType";


export const DetailPageImage = ({ token }) => {
    const [assetModalOpen, setAssetModalOpen] = useState(false);

    return (token &&
        <>
            <Modal open={assetModalOpen} onClose={() => { setAssetModalOpen(false) }}>
                <>
                    {assetType(token) === AssetTypes.Gif && <HodlVideo
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
                    {(assetType(token) === AssetTypes.Video || assetType(token) === AssetTypes.Audio) && <HodlVideo
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
                        cid={token?.image} folder={'video/upload/nfts/'} />
                        
                        }
                    {assetType(token) === AssetTypes.Image && <HodlImage
                        loading="eager"
                        sizes = "(max-width:599px) 600px, (max-width:899px) 900px, 500px"
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
                        assetType(token) === AssetTypes.Gif && 
                        <HodlVideo cid={token?.image} transformations={token?.filter} gif={true} />
                    }
                </Box>
                <Box onClick={() => setAssetModalOpen(true)}>
                    {
                        assetType(token) === AssetTypes.Image && 
                        <HodlImage 
                            cid={token?.image} 
                            effect={token?.filter} 
                            sizes = "(max-width:599px) 600px, (max-width:899px) 900px, 500px"
                        />}
                </Box>
                <Box>
                {(assetType(token) === AssetTypes.Video || assetType(token) === AssetTypes.Audio) && <HodlVideo
                    cid={token?.image} 
                    audio={assetType(token) === AssetTypes.Audio}
                    height={assetType(token) === AssetTypes.Audio ? '400px': 'auto'}
                    transformations={token?.filter} 
                    />}
                </Box>
            </Box>
        </>
    )
}