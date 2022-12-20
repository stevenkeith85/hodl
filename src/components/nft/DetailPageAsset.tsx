import { useState } from "react";
import dynamic from 'next/dynamic';
import { assetType } from "../../lib/assetType";
import { AssetTypes } from "../../models/AssetType";
import { Token } from "../../models/Token";
import { HodlImageResponsive } from "../HodlImageResponsive";

const DetailPageAssetModal = dynamic(
    () => import('./DetailPageAssetModal'),
    {
      ssr: false,
      loading: () => null
    }
  );

  const HodlVideo = dynamic(
    () => import('../HodlVideo').then(mod => mod.HodlVideo),
    {
      ssr: false,
      loading: () => null
    }
  );

  const HodlAudioBox = dynamic(
    () => import('../HodlAudioBox').then(mod => mod.HodlAudioBox),
    {
      ssr: false,
      loading: () => null
    }
  );


interface DetailPageAssetProps {
    token: Token;
}

export const DetailPageAsset: React.FC<DetailPageAssetProps> = ({ token }) => {
    const [assetModalOpen, setAssetModalOpen] = useState(false);

    return (token &&
        <>
            <DetailPageAssetModal assetModalOpen={assetModalOpen} setAssetModalOpen={setAssetModalOpen} token={token} />      
            <div style={{
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                lineHeight: 0
            }}>
                {
                    assetType(token) === AssetTypes.Gif &&
                    <div onClick={() => setAssetModalOpen(true)}>
                        <HodlVideo
                            cid={token?.properties?.asset?.uri}
                            assetFolder="image"
                            gif={true}
                            aspectRatio={token?.properties?.aspectRatio || "1:1"}
                        />
                    </div>
                }
                {
                    assetType(token) === AssetTypes.Image &&
                    <div onClick={() => setAssetModalOpen(true)}>
                        <HodlImageResponsive
                            assetFolder={"image"}
                            folder="nfts"
                            lcp={true}
                            cid={token?.properties?.asset?.uri}
                            widths={[600, 700, 800, 900, 1080]}
                            sizes="(min-width: 1200px) calc(1200px / 2), (min-width: 900px) calc(50vw / 2), 100vw"
                            aspectRatio={token?.properties?.aspectRatio}
                        />
                    </div>
                }
                {
                    assetType(token) === AssetTypes.Video &&
                    <HodlVideo
                        poster={token?.image}
                        cid={token?.properties?.asset?.uri}
                        controls={true}
                        aspectRatio={token?.properties?.aspectRatio || "1:1"}
                    />
                }
                {
                    assetType(token) === AssetTypes.Audio &&
                    <HodlAudioBox token={token} size={80} />
                }
            </div>
        </>
    )
}
