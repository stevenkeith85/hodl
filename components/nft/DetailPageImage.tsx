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
                    {assetType(token) === 'gif' && <HodlVideo sx={{
                        pointerEvents: 'none',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        video: {
                            width: 'fit-content',
                            height: 'fit-content',
                        }
                    }}
                        cid={token?.image} transformations={token?.filter} gif={true} />}
                    {assetType(token) === 'video' && <HodlVideo sx={{
                        pointerEvents: 'none',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        video: {
                            width: 'fit-content',
                            height: 'fit-content',
                        }
                    }}

                        cid={token?.image} directory={'video/upload/nfts/'} />}
                    {assetType(token) === 'image' && <HodlImage2 sx={{
                        pointerEvents: 'none',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        img: {
                            width: 'fit-content',
                            height: 'fit-content',
                        }
                    }}
                        image={token?.image} effect={token?.filter} />}
                </>
            </Modal>
            <Head>
                {
                    token && token.mimeType === 'image/gif' ?
                        <link rel="preload" href={createCloudinaryUrl('image', 'upload', null, folder, token.image, 'mp4')} />
                        : <link rel="preload" href={createCloudinaryUrl('image', 'upload', `f_auto,c_limit,w_${calcImageWidthWeNeed()},q_auto`, folder, token.image)} />
                }
            </Head>
            <Box>
                <Box onClick={() => setAssetModalOpen(true)}>
                    {assetType(token) === 'gif' && <HodlVideo cid={token?.image} transformations={token?.filter} gif={true} />}
                </Box>
                <Box onClick={() => setAssetModalOpen(true)}>
                    {assetType(token) === 'image' && <HodlImage2 image={token?.image} effect={token?.filter} />}
                </Box>
                {assetType(token) === 'video' && <HodlVideo cid={token?.image} transformations={token?.filter} />}
            </Box>

        </>
    )
}