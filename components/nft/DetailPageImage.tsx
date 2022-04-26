import { Box, Modal } from "@mui/material";
import Head from "next/head";
import { HodlVideo } from "../HodlVideo";
import { assetType, createCloudinaryUrl, imageSizes } from "../../lib/utils";
import { HodlImage2 } from "../HodlImage2";
import { useState } from "react";


export const DetailPageImage = ({ token, folder = 'nfts' }) => {
    const [assetModalOpen, setAssetModalOpen] = useState(false);

    const calcImageWidthWeNeed = () => {
        const findFindSizeBigEnough = (width) => {
            for (let i = 0; i < imageSizes.length; i++) {
                if (width > imageSizes[i]) {
                    continue;
                }
                return imageSizes[i];
            }
        }

        const vw = window.innerWidth;
        const devicePixelRatio = window.devicePixelRatio;

        let imageWidth;

        if (vw < 900) {
            imageWidth = vw * devicePixelRatio;
        } else if (vw < 1550) {
            imageWidth = (vw / 2) * devicePixelRatio;
        } else {
            imageWidth = devicePixelRatio * 744;
        }
        return findFindSizeBigEnough(imageWidth);
    };

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

                        cid={token?.image} directory={'video/upload/nfts/'} />}
                    {assetType(token) === 'image' && <HodlImage2
                        imgSizes="66vw"
                        sx={{
                            pointerEvents: 'none',
                            justifyContent: 'center',
                            alignItems: 'center',
                            img: {
                                height: '66vh',
                                width: '66vw',
                                objectFit: 'scale-down',
                                "&.lowRes": {
                                    display: 'none'
                                }
                            }
                        }}
                        image={token?.image} effect={token?.filter} />}
                </>
            </Modal>
            <Box>
                <Box onClick={() => setAssetModalOpen(true)}>
                    {assetType(token) === 'gif' && <HodlVideo cid={token?.image} transformations={token?.filter} gif={true} />}
                </Box>
                <Box onClick={() => setAssetModalOpen(true)}>
                    {assetType(token) === 'image' && <HodlImage2 image={token?.image} effect={token?.filter} fit="scale-down" />}
                </Box>
                {assetType(token) === 'video' && <HodlVideo cid={token?.image} transformations={token?.filter} />}
            </Box>

        </>
    )
}