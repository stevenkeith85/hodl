import { Box, Modal } from "@mui/material";
import Head from "next/head";
import { HodlVideo } from "../HodlVideo";
import { assetType, createCloudinaryUrl } from "../../lib/utils";
import { HodlImage2 } from "../HodlImage2";
import { useState } from "react";


export const DetailPageImage = ({token, folder='nfts'}) => {

    const [assetModalOpen, setAssetModalOpen] = useState(false);
    // This is based on
    // "(max-width:899px) 100vw, (max-width:1549px) 50vw, 744px"
    const calcImageWidthWeNeed = () => {
        const findFindSizeBigEnough = (width) => {
            const sizes = [400, 450, 500, 600, 700, 800, 900, 1000, 1200, 1350, 1500, 1700];

            for (let i = 0; i < sizes.length; i++ ) {
                if (width > sizes[i]) {
                    continue;
                }
                return sizes[i];
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
    
    return ( token &&
        <>
        <Modal open={assetModalOpen} onClose={() => { setAssetModalOpen(false)}}>
            <>
                    { assetType(token) === 'gif' && <HodlVideo sx={{
                        pointerEvents: 'none', 
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        video: {
                            width: 'fit-content',
                            height: 'fit-content',
                        }
                    }} 
                    cid={token?.image} transformations={token?.filter} gif={true}/> }
                    { assetType(token) === 'video' && <HodlVideo sx={{
                        pointerEvents: 'none', 
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        video: {
                            width: 'fit-content',
                            height: 'fit-content',
                        }
                    }} 
                    
                    cid={token?.image} directory={'video/upload/nfts/'}/> }
                    { assetType(token) === 'image' && <HodlImage2 sx={{
                        pointerEvents: 'none', 
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        img: {
                            width: 'fit-content',
                            height: 'fit-content',
                        }
                    }} 
                    image={token?.image} effect={token?.filter}/> }
            </>
        </Modal>
        <Head>
            {
                token && token.mimeType === 'image/gif' ?
                <link rel="preload" href={createCloudinaryUrl('image', 'upload', null, folder, token.image, 'mp4')} />
                : <link rel="preload" href={createCloudinaryUrl('image', 'upload', `f_auto,c_limit,w_${calcImageWidthWeNeed()},q_auto`, folder, token.image)} />
            }
        </Head>
        <Box sx={{ position: 'relative', img: { borderRadius: 1} }} >
                
                <Box onClick={() => setAssetModalOpen(true)}>
                    { assetType(token) === 'gif' && <HodlVideo cid={token?.image} transformations={token?.filter} gif={true}/> }
                </Box>
                <Box onClick={() => setAssetModalOpen(true)}>
                    { assetType(token) === 'image' && <HodlImage2 image={token?.image} effect={token?.filter}/> }    
                </Box>
                { assetType(token) === 'video' && <HodlVideo cid={token?.image} transformations={token?.filter}/> }
        </Box>
        
        </>
    )
}