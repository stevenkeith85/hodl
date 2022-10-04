import { Box, NoSsr } from "@mui/material";
import { useEffect, useRef } from "react";

interface HodlAudioProps {
    cid: string;
    folder?: string;
    environment?: string;
    sx?: object;
    controls?: boolean;
    height?: string;
    width?: string;
    onLoad?: Function;
    mimeType?: string;
}

export const HodlAudio = ({
    cid,
    folder = 'nfts',
    environment = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER,
    sx = {},
    controls = true,
    height = 'auto',
    width = '100%',
    onLoad = null,
    mimeType = 'audio/mp3'
}: HodlAudioProps) => {
    const makeCloudinaryAudioUrl = () => {
        let cloudinaryUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/video/upload`; // cloudinary stores audio under the video folder

        return `${cloudinaryUrl}/${environment}/${folder}/${cid}`
    }

    const asset = makeCloudinaryAudioUrl();
    const audio = useRef(null);

    useEffect(() => {
        try {
            // user does this
            audio?.current?.addEventListener('volumechange', (event) => {
                localStorage.setItem('muted', audio?.current?.muted);
            });
        } catch (e) {
        }
    }, [audio?.current])

    return (
        <>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height,
                width,
                audio: {
                    width: '100%'
                },
                ...sx
            }}>
                <NoSsr>
                    <audio
                        onLoadedData={() => {
                            if (onLoad) {
                                onLoad(audio.current)
                            }
                        }
                        }
                        ref={audio}
                        autoPlay={false} // https://developer.chrome.com/blog/autoplay/
                        muted={typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('muted')) : false} // TODO: Not confident this works tbh
                        controls={controls}
                        controlsList="nodownload">
                        <>
                            <source src={`${asset}.${mimeType.split('/')[1]}`} type={mimeType} />
                        </>
                    </audio>
                </NoSsr>
            </Box>
        </>
    )
}