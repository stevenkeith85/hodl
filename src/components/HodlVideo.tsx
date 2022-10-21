import { Box, NoSsr } from "@mui/material";
import { useEffect, useRef } from "react";
import { grey } from "@mui/material/colors";
import Head from "next/head";

interface HodlVideoProps {
    cid: string;
    folder?: string;
    environment?: string;
    sx?: object;
    controls?: boolean;
    gif?: boolean;
    height?: string;
    width?: string;
    onLoad?: Function;
    assetFolder?: "video" | "image" // gifs are stored in the image folder. we display them as videos though, to save bandwidth
    poster?: string,
    maxHeight?: string;
}

export const HodlVideo = ({
    cid,
    folder = 'nfts',
    environment = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER,
    sx = {},
    controls = true,
    gif = false,
    height = '100%',
    width = '100%',
    onLoad = null,
    assetFolder = "video",
    poster = null,
    maxHeight = "100%"
}: HodlVideoProps) => {
    const makeCloudinaryVideoUrl = () => {
        let cloudinaryUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/${assetFolder}/upload`;

        return `${cloudinaryUrl}/${environment}/${folder}/${cid}`
    }

    const asset = makeCloudinaryVideoUrl();
    const video = useRef(null);

    useEffect(() => {
        try {
            video?.current?.addEventListener('volumechange', (event) => {
                localStorage.setItem('muted', video?.current?.muted);
            });
        } catch (e) {
        }
    }, [video?.current])

    return (
        <>
            <Box sx={{
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height,
                width,
                background: grey[200],
                video: {
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '100%',
                    maxHeight,
                    objectFit: 'scale-down'
                },
                ...sx
            }}>
                <NoSsr>
                    {poster ? <video
                        //@ts-ignore
                        onLoadedMetadata={() => { // on loaded data doesnt work on mobiles
                            if (onLoad) {
                                onLoad(video.current)
                            }
                        }
                        }
                        poster={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload/${environment}/${folder}/${poster}.jpg`}
                        ref={video}
                        autoPlay={gif} // we autoplay gifs. videos are played when the user scrolls past them
                        loop={gif}
                        muted={typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('muted')) : false} // TODO: Not confident this works tbh
                        controls={!gif && controls}
                        controlsList="nodownload"
                        preload="metadata"
                    >
                        <>
                            <source type="video/mp4" src={`${asset}.mp4`} />
                            Your browser does not support HTML5 video tag.
                        </>
                    </video>
                        :
                        <video
                            //@ts-ignore
                            onLoadedMetadata={() => { // on loaded data doesnt work on mobiles
                                if (onLoad) {
                                    onLoad(video.current)
                                }
                            }
                            }
                            ref={video}
                            autoPlay={gif} // we autoplay gifs. videos are played when the user scrolls past them
                            loop={gif}
                            muted={typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('muted')) : false} // TODO: Not confident this works tbh
                            controls={!gif && controls}
                            controlsList="nodownload"
                            preload="metadata"
                        >
                            <>
                                <source type="video/mp4" src={`${asset}.mp4`} />
                                Your browser does not support HTML5 video tag.
                            </>
                        </video>
                    }
                </NoSsr>
            </Box>
        </>
    )
}