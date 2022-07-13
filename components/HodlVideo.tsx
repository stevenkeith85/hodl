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
    width?: string;
    preload?: string,
    onLoad?: Function;
    autoPlay?: boolean;
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
    width = '100%',
    preload = "auto",
    onLoad = null,
    autoPlay = false
}: HodlVideoProps) => {
    const asset = `${createCloudinaryUrl(gif ? 'image' : 'video', 'upload', transformations, folder, cid)}`
    const video = useRef(null);

    // If the video is brought onscreen, play it (if the user hasn't already watched it).
    // If it goes offscreen pause it.
    const pauseVideoOffscreen = () => {
        if (gif) {
            return;
        }
        
        let observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.intersectionRatio !== 1) {
                    video?.current?.pause();
                } else if (!video?.current?.ended) {
                    ((video.current) as HTMLMediaElement).muted = JSON.parse(localStorage.getItem('muted'));
                    video?.current?.play();
                }
            });
        }, { threshold: 1 });

        observer.observe(video.current);
    }

    const listenToPausePlayEvents = () => {
        video?.current?.addEventListener('volumechange', (event) => {
            localStorage.setItem('muted', video?.current?.muted);
        });
    }

    useEffect(() => {
        try {
            pauseVideoOffscreen();
            listenToPausePlayEvents()
        } catch (e) {
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
                height,
                width,
                video: {
                    objectFit: audio ? 'scale-down' : 'cover',
                    objectPosition: 'center',
                    borderRadius: 1,
                    background: '#fafafa',
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
                    width={width}
                    ref={video}
                    autoPlay={true}
                    loop={gif}
                    // muted={JSON.parse(localStorage.getItem('muted'))}
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