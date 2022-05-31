import { Box, Skeleton } from "@mui/material";
import { useEffect, useRef } from "react";
import { createCloudinaryUrl } from "../lib/utils";

interface HodlVideoProps {
    cid: string;
    folder?: string;
    transformations?: string;
    sx?: object;
    controls?: boolean;
    onlyPoster?: boolean;
    pauseWhenOffScreen?: boolean;
    gif?: boolean;
    audio?: boolean;
    height?: string;
    preload?: string,
    onLoad?: Function;
}

export const HodlVideo = ({
    cid,
    folder = 'nfts',
    transformations = null,
    sx = {},
    controls = true,
    onlyPoster = false,
    pauseWhenOffScreen = true,
    gif = false,
    audio = false,
    height = 'auto',
    preload="auto",
    onLoad = null,
}: HodlVideoProps) => {
    const asset = `${createCloudinaryUrl(gif ? 'image' : 'video', 'upload', transformations, folder, cid)}`
    const video = useRef(null);

    useEffect(() => {
        if (pauseWhenOffScreen && !gif) {
            try {
                let observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.intersectionRatio !== 1) {
                            video?.current?.pause();
                        }
                    });
                }, { threshold: 1 });

                observer.observe(video.current);
            } catch (e) {

            }
        }
    }, [video?.current])

    const getPoster = () => {
        if (gif) {
            return null;
        }
        
        if (audio) {
            return '/hodlmymoonmusic.png'
        }
        
        return `${asset}.jpg`;
    }

    return (
        <>
        <Box sx={{
            display: 'flex',
            height: height,
            video: {
                objectFit: audio ? 'scale-down': 'cover',
                objectPosition: 'center',
                borderRadius: 1,
                background: '#fafafa'
            },
            ...sx
        }}>
            {/* <Skeleton variant="rectangular" width="100%" height={height}></Skeleton> */}
            <video
                onLoadedData={() => {
                    if (onLoad) {
                        onLoad()
                    }
                }
                }
                preload={preload}
                width="100%"
                ref={video}
                autoPlay={gif}
                loop={gif}
                muted={gif}
                controls={!gif && controls}
                controlsList="nodownload"
                poster={getPoster()}>
                {!onlyPoster && (<>
                    <source type="video/mp4" src={`${asset}.mp4`} />
                    <source type="video/webm" src={`${asset}.webm`} />
                    Your browser does not support HTML5 video tag.
                    {gif && <a href={`${asset}.gif`} >Click here to view original GIF</a>}
                </>)}
            </video>
        </Box>
        </>
    )
}