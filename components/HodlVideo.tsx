import { Box, Skeleton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { createCloudinaryUrl } from "../lib/utils";

export const HodlVideo = ({ cid, directory = 'nfts', gif = false, controls = true, onlyPoster = false, transformations = null, sx = {}, onLoad = null, pauseWhenOffScreen = true, square=false}) => {
    const asset = `${createCloudinaryUrl(gif ? 'image' : 'video', 'upload', transformations, directory, cid)}`
    const video = useRef(null);

    const [videoLoaded, setVideoLoaded] = useState(false);

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

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'left',
            borderRadius: 1,
            width: `100%`,
            height: `100%`,
            position: 'relative',
            video: {
                maxWidth: `100%`,
                objectFit: "cover",
                objectPosition: 'center',
                borderRadius: 1,
            },
            ...sx
        }}>
            <video
                ref={video}
                onLoadedData={() => {
                    setVideoLoaded(true);
                    if (onLoad) {
                        onLoad()
                    }
                }
                }
                autoPlay={gif}
                loop={gif}
                muted={gif}
                controls={!gif && controls}
                controlsList="nodownload"
                poster={gif ? null : `${asset}.jpg`}>
                {Boolean(!onlyPoster) && (<>
                    <source type="video/mp4" src={`${asset}.mp4`} />
                    <source type="video/webm" src={`${asset}.webm`} />
                    Your browser does not support HTML5 video tag.
                    {gif && <a href={`${asset}.gif`} >Click here to view original GIF</a>}
                </>)}
            </video>
        </Box>
    )
}