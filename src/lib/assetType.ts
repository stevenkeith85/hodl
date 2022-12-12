import { AssetTypes } from "../models/AssetType";
import { FullToken } from "../models/FullToken";
import { Token } from "../models/Token";


export const assetType = (nft: Token | FullToken): AssetTypes => {
  if (!nft?.properties?.asset?.mimeType) {
    return AssetTypes.Image;
  }

  if (nft?.properties?.asset?.mimeType === 'image/gif') {
    return AssetTypes.Gif;
  }

  if (nft?.properties?.asset?.mimeType?.indexOf('video') !== -1) {
    return AssetTypes.Video;
  }

  if (nft?.properties?.asset?.mimeType?.indexOf('image') !== -1) {
    return AssetTypes.Image;
  }

  if (nft?.properties?.asset?.mimeType?.indexOf('audio') !== -1) {
    return AssetTypes.Audio;
  }

  return null;
};
