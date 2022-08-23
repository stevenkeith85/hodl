import { Box } from "@mui/material";
import { useCallback, useEffect, useRef } from "react";
import { createCloudinaryUrl } from "../lib/utils";

interface HodlVideoProps {
    cid: string;
    folder?: string;
    transformations?: string;
    sx?: object;
    controls?: boolean;
    onlyPoster?: boolean;
    gif?: boolean;
    audio?: boolean;
    height?: string;
    width?: string;
    onLoad?: Function;
}

export const HodlVideo = ({
    cid,
    folder = 'nfts',
    transformations = null,
    sx = {},
    controls = true,
    onlyPoster = false,
    gif = false,
    audio = false,
    height = 'auto',
    width = '100%',
    onLoad = null,
}: HodlVideoProps) => {
    const asset = `${createCloudinaryUrl(gif ? 'image' : 'video', 'upload', transformations, folder, cid)}`
    const video = useRef(null);

    // If the video is brought onscreen, play it (if the user hasn't already watched it).
    // If it goes offscreen pause it.
    const pauseVideoOffscreen = useCallback(() => {
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
    }, [gif]);

    useEffect(() => {
        try {
            pauseVideoOffscreen();
            
            video?.current?.addEventListener('volumechange', (event) => {
                localStorage.setItem('muted', video?.current?.muted);
            });
        } catch (e) {
        }
    }, [pauseVideoOffscreen])


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
                    muted={JSON.parse(localStorage.getItem('muted'))}
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