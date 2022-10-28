import { HodlVideo } from "../HodlVideo";
import { assetType, getTopPadding } from "../../lib/utils";
import { useState } from "react";
import { AssetTypes } from "../../models/AssetType";
import { HodlImageResponsive } from "../HodlImageResponsive";
import { HodlAudio } from "../HodlAudio";
import { HodlAudioBox } from "../HodlAudioBox";
import { Token } from "../../models/Token";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Skeleton from "@mui/material/Skeleton";

interface DetailPageAssetProps {
    token: Token;
}
export const DetailPageAsset: React.FC<DetailPageAssetProps> = ({ token }) => {
    const [assetModalOpen, setAssetModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    return (token &&
        <>
            <Modal
                open={assetModalOpen}
                onClose={() => { setAssetModalOpen(false) }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: '100vw',
                        height: '100vh',
                        justifyContent: 'center',
                        alignItems: 'center',
                        pointerEvents: 'none',
                    }}
                >
                    <Box sx={{
                        maxWidth: '90%',
                        width: '900px',
                        pointerEvents: 'none',
                    }}>
                        {
                            assetType(token) === AssetTypes.Gif && <HodlVideo
                                sx={{
                                    video: {
                                        height: '80vh',
                                        width: '80vw',
                                        objectFit: 'scale-down',
                                    }
                                }}
                                cid={token?.properties?.asset?.uri}
                                assetFolder="image"
                                gif={true}
                            />
                        }
                        {
                            assetType(token) === AssetTypes.Video && <HodlVideo
                                sx={{
                                    video: {
                                        height: '80vh',
                                        width: '80vw',
                                        objectFit: 'scale-down',
                                    }
                                }}
                                cid={token?.properties?.asset?.uri}
                                folder={'video/upload/nfts/'}
                            />
                        }
                        {
                            assetType(token) === AssetTypes.Audio && <HodlAudio
                                cid={token?.properties?.asset?.uri}
                                folder={'video/upload/nfts/'}
                            />
                        }
                        {
                            assetType(token) === AssetTypes.Image && <HodlImageResponsive
                                assetFolder={"image"}
                                folder="nfts"
                                widths={[1080]}
                                sizes="1080px"
                                cid={token?.properties?.asset?.uri}
                                aspectRatio={token?.properties?.aspectRatio}
                            />
                        }
                    </Box>
                </Box>
            </Modal>
            <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{
                    display: loading ? 'block' : 'none',
                    width: "100%",
                    paddingTop: token.properties.aspectRatio ? `${getTopPadding(token.properties.aspectRatio)}%` : '100%'
                }}
            >
            </Skeleton>
            <Box sx={{
                display: loading ? 'none' : 'block',
            }}>
                {
                    assetType(token) === AssetTypes.Gif &&
                    <Box onClick={() => setAssetModalOpen(true)}>
                        <HodlVideo
                            cid={token?.properties?.asset?.uri}
                            assetFolder="image"
                            gif={true}
                            onLoad={() => setLoading(false)}
                            aspectRatio={token?.properties?.aspectRatio}
                        />
                    </Box>
                }
                {
                    assetType(token) === AssetTypes.Image &&
                    <Box onClick={() => setAssetModalOpen(true)}>
                        <HodlImageResponsive
                            assetFolder={"image"}
                            folder="nfts"
                            lcp={true}
                            cid={token?.properties?.asset?.uri}
                            widths={[500, 600, 700, 800, 900, 1000, 1080]}
                            sizes="(min-width: 1200px) calc(1200px / 2), (min-width: 900px) calc(50vw / 2), 100vw"
                            onLoad={() => setLoading(false)}
                            aspectRatio={token?.properties?.aspectRatio}
                        />
                    </Box>
                }
                {
                    assetType(token) === AssetTypes.Video &&
                    <HodlVideo
                        poster={token?.image}
                        cid={token?.properties?.asset?.uri}
                        controls={true}
                        aspectRatio={token?.properties?.aspectRatio || "1:1"}
                        onLoad={() => setLoading(false)}
                    />
                }
                {
                    assetType(token) === AssetTypes.Audio &&
                    <HodlAudioBox token={token} size={80} />
                }
            </Box>
        </>
    )
}