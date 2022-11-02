import { assetType } from "../../lib/utils";

import { AssetTypes } from "../../models/AssetType";

import { HodlImageResponsive } from "../HodlImageResponsive";
import { HodlVideo } from "../HodlVideo";
import { HodlAudio } from "../HodlAudio";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";


export default function DetailPageAssetModal({assetModalOpen, setAssetModalOpen, token}) {
    return (
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
    )
  }
