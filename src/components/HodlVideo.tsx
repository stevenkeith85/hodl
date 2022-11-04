import NoSsr from "@mui/material/NoSsr";
import { useEffect, useRef } from "react";

import { makeCloudinaryUrl } from "../lib/cloudinaryUrl";
import { getTopPadding } from "../lib/utils";

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
    aspectRatio?: string;
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
    aspectRatio = "1:1"
}: HodlVideoProps) => {
    const asset = makeCloudinaryUrl(assetFolder, folder as 'nfts' | 'uploads', cid, {});
    const video = useRef(null);

    const setMutedLocalStorage = () => {
        localStorage.setItem('muted', video?.current?.muted);
    };

    useEffect(() => {
        try {
            video?.current?.addEventListener('volumechange', setMutedLocalStorage);

            return () => {
                window.removeEventListener('volumechange', setMutedLocalStorage);
            };
        } catch (e) {
        }
    }, [video?.current])

    return (
        <>
            <div
                style={{
                    position: 'relative',
                    width: `100%`,
                    paddingTop: `${getTopPadding(aspectRatio)}%`,
                    background: '#f0f0f0',
                }}>
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        width: '100%',
                        height: '100%',
                        top: '50%',
                        transform: 'translateY(-50%)',
                    }}>
                    <NoSsr>
                        {poster ? <video
                        style={{
                            width: `100%`,
                            height: '100%'
                        }}
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
                            style={{
                                width: `100%`,
                                height: '100%'
                            }}
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
                </div>
            </div>
        </>
    )
}
