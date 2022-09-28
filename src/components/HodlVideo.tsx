import { Box, NoSsr } from "@mui/material";
import { useEffect, useRef } from "react";
import { grey } from "@mui/material/colors";

interface HodlVideoProps {
    cid: string;
    folder?: string;
    environment?: string;
    sx?: object;
    controls?: boolean;
    onlyPoster?: boolean;
    gif?: boolean;
    height?: string;
    width?: string;
    onLoad?: Function;
    assetFolder?: "video" | "image" // gifs are stored in the image folder. we display them as videos though, to save bandwidth
}

export const HodlVideo = ({
    cid,
    folder = 'nfts',
    environment = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER,
    sx = {},
    controls = true,
    onlyPoster = false,
    gif = false,
    height = '100%',
    width = '100%',
    onLoad = null,
    assetFolder="video",
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


    const getPoster = () => {
        if (gif) {
            return null;
        }

        return `${asset}.jpg`;
    }

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
                    maxHeight: '100%',
                    objectFit: 'scale-down'
                },
                ...sx
            }}>
                <NoSsr>
                    <video
                        onLoadedData={() => {
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
                        poster={getPoster()}>
                        {!onlyPoster && (<>
                            <source type="video/mp4" src={`${asset}.mp4`} />
                            <source type="video/webm" src={`${asset}.webm`} />
                            Your browser does not support HTML5 video tag.
                            {gif && <a href={`${asset}.gif`} >Click here to view original GIF</a>}
                        </>)}
                    </video>
                </NoSsr>
            </Box>
        </>
    )
}