import { Box, NoSsr } from "@mui/material";
import { useEffect, useRef } from "react";
import { grey } from "@mui/material/colors";
import { makeCloudinaryUrl } from "../lib/cloudinaryUrl";

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
    onLoad = null,
    assetFolder = "video",
    poster = null,
}: HodlVideoProps) => {
    const asset = makeCloudinaryUrl(assetFolder, folder as 'nfts' | 'uploads', cid, {});
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
                width: `100%`,
                background: grey[200],
                video: {
                    width: '100%',
                    height: 'auto',
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