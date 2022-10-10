import { Box, Modal, Skeleton } from "@mui/material";
import { HodlVideo } from "../HodlVideo";
import { assetType } from "../../lib/utils";
import { useState } from "react";
import { AssetTypes } from "../../models/AssetType";
import { HodlImageResponsive } from "../HodlImageResponsive";
import { HodlAudio } from "../HodlAudio";
import { HodlAudioBox } from "../HodlAudioBox";
import { Token } from "../../models/Token";

interface DetailPageAssetProps {
    token: Token;
}
export const DetailPageAsset: React.FC<DetailPageAssetProps> = ({ token }) => {
    const [assetModalOpen, setAssetModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const asset = <Box
        sx={{
            cursor: 'pointer'
        }}
    >
        <Box onClick={() => setAssetModalOpen(true)}>
            {
                assetType(token) === AssetTypes.Gif &&
                <HodlVideo
                    cid={token?.properties?.asset?.uri}
                    assetFolder="image"
                    gif={true}
                    onLoad={() => setLoading(false)}
                />
            }
        </Box>
        <Box onClick={() => setAssetModalOpen(true)}>
            {
                assetType(token) === AssetTypes.Image &&
                <HodlImageResponsive
                    cid={token?.properties?.asset?.uri}
                    widths={[500, 600, 700, 800, 900, 1000, 1080]}
                    sizes="(min-width: 1200px) calc(1200px / 2), (min-width: 900px) calc(50vw / 2), 100vw"
                    onLoad={() => setLoading(false)}
                />
            }
        </Box>
        <Box>
            {
                assetType(token) === AssetTypes.Video &&
                <HodlVideo
                    poster={token?.image}
                    cid={token?.properties?.asset?.uri}
                    height={'auto'}
                    onLoad={() => setLoading(false)}
                />
            }
        </Box>
        {
            assetType(token) === AssetTypes.Audio &&
            <HodlAudioBox token={token} size={80} />
        }
    </Box>

    return (token &&
        <>
            <Modal
                open={assetModalOpen}
                onClose={() => { setAssetModalOpen(false) }}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    sx={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                        pointerEvents: 'none',
                    }}
                >
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
                            widths={[1080]}
                            sizes="1080px"
                            cid={token?.properties?.asset?.uri} />
                    }
                </Box>
            </Modal>
            {loading ?
                <Skeleton
                    variant="rectangular"
                    animation="wave"
                >
                    {asset}
                </Skeleton> :
                <>{asset}</>
            }
        </>
    )
}