import { useEffect, useRef } from "react";

import Head from "next/head";

import { makeCloudinaryUrl } from "../lib/cloudinaryUrl";
import { getTopPadding } from "../lib/getTopPadding";


export const HodlImageResponsive = ({
    assetFolder,
    folder,
    cid,

    aspectRatio = null,
    effect = null,
    round = null,
    widths=[600, 700, 800, 900, 1080], // You should do some experimentation and pick 6 or so

    sizes, // e.g. sizes="(min-width: 900px) 50vw, (min-width: 1200px) calc(1200px / 2)"

    onLoad = null,
    lcp = false, // set true if this image is the largest content paint so that it takes priority on loading
    extension = null
}) => {

    const srcSet = widths.map(width => `${makeCloudinaryUrl(assetFolder as "image" | "video", folder as "nfts" | "uploads", cid, { crop: 'fill', effect, aspect_ratio: aspectRatio, width: `${width}`, round }, extension)} ${width}w`).join(',');

    const src = makeCloudinaryUrl(assetFolder as "image" | "video", folder as "nfts" | "uploads", cid, { crop: 'fill', effect, aspect_ratio: aspectRatio, width: `${widths[0]}`, round }, extension);

    const imgRef = useRef(null);

    // onload doesn't fire if the image is being loaded from cache. You can use the complete property to check for this case.
    useEffect(() => {
        if (imgRef.current) {
            if (imgRef.current.complete && onLoad) {
                onLoad();
            }
        }
    }, []);

    return (
        <>
            <Head>
                {lcp ?
                    <link
                        // @ts-ignore
                        fetchpriority="high"
                        key={cid}
                        rel="preload"
                        as="image"
                        href={src}
                        // @ts-ignore
                        imagesrcset={srcSet}
                        // @ts-ignore
                        imagesizes={sizes}
                    /> :
                    <link
                        key={cid}
                        rel="preload"
                        as="image"
                        href={src}
                        // @ts-ignore
                        imagesrcset={srcSet}
                        // @ts-ignore
                        imagesizes={sizes}
                    />
                }
            </Head>
            <div
                style={{
                    position: 'relative',
                    width: `100%`,
                    paddingTop: `${getTopPadding(aspectRatio)}%`
                }}>
                <div
                    style={{
                        position: aspectRatio ? 'absolute' : 'static',
                        top: 0,
                        left: 0,
                        width: '100%',
                    }}>
                    {lcp ?
                        <img
                            style={{ 
                                width: '100%' 
                            }}
                            // @ts-ignore
                            fetchpriority="high"
                            onLoad={() => {
                                if (onLoad) {
                                    onLoad();
                                }
                            }}
                            src={src}
                            srcSet={srcSet}
                            alt=""
                            sizes={sizes}
                            loading="eager"

                            decoding="auto"
                            ref={imgRef}
                        /> :
                        <img
                            style={{ width: '100%' }}
                            onLoad={() => {
                                if (onLoad) {
                                    onLoad();
                                }
                            }}
                            src={src}
                            srcSet={srcSet}
                            alt=""
                            sizes={sizes}
                            loading="eager"
                            decoding="auto"
                            ref={imgRef}
                        />
                    }
                </div>
            </div>
        </>
    )
}
