import { Box, NoSsr } from "@mui/material";
import { useEffect, useRef } from "react";
//import { useInView } from 'react-intersection-observer'; // TODO: Probably remove this; don't think we'll need it

interface HodlVideoProps {
    cid: string;
    folder?: string;
    environment?: "dev" | "staging" | "prod";
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
    environment = 'dev', // const environment = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER;
    sx = {},
    controls = true,
    onlyPoster = false,
    gif = false,
    audio = false,
    height = 'auto',
    width = '100%',
    onLoad = null,
}: HodlVideoProps) => {
    const makeCloudinaryVideoUrl = () => {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
        let cloudinaryUrl = `https://res.cloudinary.com/${cloudName}/video/upload`;

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
    }, [])


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
                <NoSsr>
                    <video
                        onLoadedData={() => {
                            if (onLoad) {
                                onLoad(video.current)
                            }
                        }
                        }
                        width={width}
                        ref={video}
                        autoPlay={false}
                        loop={gif}
                        muted={typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('muted')) : false}
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