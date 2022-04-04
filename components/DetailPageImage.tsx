import { Box, Stack, Typography } from "@mui/material";
import Head from "next/head";
import memoize from 'memoizee';
import { HodlImage } from "./HodlImage";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { HodlVideo } from "./HodlVideo";
import { assetType } from "../lib/utils";
import { WalletContext } from "../pages/_app";
import { useState, useContext, useEffect } from 'react';
import { useLike } from "../hooks/useLike";
import { Likes } from "./Likes";

export const DetailPageImage = ({token, folder='nfts'}) => {
    // const [tokenLikesCount, userLikesThisToken, toggleLike] = useTokenLikes(token);
    
    // This is based on
    // "(max-width:899px) 100vw, (max-width:1549px) 50vw, 744px"
    const calcImageWidthWeNeed = memoize(() => {
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
    });
    
    return ( token &&
        <>
        <Head>
            {
                token && token.mimeType === 'image/gif' ?
                <link rel="preload" href={`https://res.cloudinary.com/dyobirj7r/${folder}/${token.image}.mp4`} />
                : <link rel="preload" href={`https://res.cloudinary.com/dyobirj7r/f_auto,c_limit,w_${calcImageWidthWeNeed()},q_auto/${folder}/${token.image}`} />
            }
        </Head>
        <Box sx={{ position: 'relative', img: { borderRadius: 1} }}>
                { assetType(token) === 'gif' && <HodlVideo cid={token?.image} gif={true}/> }
                { assetType(token) === 'video' && <HodlVideo cid={token?.image} directory={'video/upload/nfts/'}/> }
                { assetType(token) === 'image' && <HodlImage image={token?.image} sx={{ width: '100%'}} /> }
                <Likes token={token} sx={{padding: 1, position: 'absolute', top: 10, right: 10}}/>
        </Box>
        
        </>
    )
}