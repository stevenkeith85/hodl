import { Box, Modal } from "@mui/material";
import { HodlVideo } from "../HodlVideo";
import { assetType } from "../../lib/utils";
import { HodlImage } from "../HodlImage";
import { useState } from "react";
import { AssetTypes } from "../../models/AssetType";
import { HodlImageResponsive } from "../HodlImageResponsive";


export const DetailPageImage = ({ token }) => {
    const [assetModalOpen, setAssetModalOpen] = useState(false);

    return (token &&
        <>
            <Modal open={assetModalOpen} onClose={() => { setAssetModalOpen(false) }}>
                <Box
                    display="flex"
                    flexDirection="column"
                    sx={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                        pointerEvents: 'none',
                    }}
                >
                    {assetType(token) === AssetTypes.Gif && <HodlVideo
                        sx={{
                            // pointerEvents: 'none',
                            // justifyContent: 'center',
                            // alignItems: 'center',
                            video: {
                                height: '80vh',
                                width: '80vw',
                                objectFit: 'scale-down',
                            }
                        }}
                        cid={token?.image} transformations={token?.filter} gif={true} />}
                    {(assetType(token) === AssetTypes.Video || assetType(token) === AssetTypes.Audio) && <HodlVideo
                        sx={{
                            video: {
                                height: '80vh',
                                width: '80vw',
                                objectFit: 'scale-down',
                            }
                        }}
                        cid={token?.image} folder={'video/upload/nfts/'} />

                    }
                    {assetType(token) === AssetTypes.Image && <HodlImageResponsive
                        widths={[1080]}
                        sizes="1080px"
                        cid={token?.image} />}
                </Box>
            </Modal>
            <Box sx={{ cursor: 'pointer' }}>
                <Box onClick={() => setAssetModalOpen(true)}>
                    {
                        assetType(token) === AssetTypes.Gif &&
                        <HodlVideo cid={token?.image} transformations={token?.filter} gif={true} />
                    }
                </Box>
                <Box onClick={() => setAssetModalOpen(true)}>
                    {
                        assetType(token) === AssetTypes.Image &&
                        <HodlImageResponsive
                            cid={token?.image}
                            widths={[500, 600, 700, 800, 900, 1000, 1080]}
                            sizes="(min-width: 1200px) calc(1200px / 2), (min-width: 900px) calc(50vw / 2), 100vw"
                        />}
                </Box>
                <Box>
                    {(assetType(token) === AssetTypes.Video || assetType(token) === AssetTypes.Audio) && <HodlVideo
                        cid={token?.image}
                        audio={assetType(token) === AssetTypes.Audio}
                        height={assetType(token) === AssetTypes.Audio ? '400px' : 'auto'}
                        transformations={token?.filter}
                    />}
                </Box>
            </Box>
        </>
    )
}