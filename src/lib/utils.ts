import { AssetTypes } from "../models/AssetType";
import { FullToken } from "../models/Nft";
import { Token } from "../models/Token";
import { commercial, nonCommercial, token } from "./copyright";

export const TAG_PATTERN = /#([\d\w_]{3,25})(\s|$)/g;
export const MAX_TAGS_PER_TOKEN = 6;

export const TRANSACTION_TIMEOUT = 10000;

export const imageFilters: {
  code: "improve" | "athena" | "aurora" | "hairspray" | "grayscale"
  name: string;
}[] = [
    { code: null, name: 'original' },
    { code: "improve", name: 'improve' },
    { code: "grayscale", name: 'greyscale' },
    { code: "athena", name: 'athena' },
    { code: "aurora", name: 'aurora' },
    { code: "hairspray", name: 'hairspray' }
  ];

export const validFilter = (filter) => {
  const codes = imageFilters.map(f => f.code);

  return codes.find(code => code === filter);
}

export const getTopPadding = (ratio) => {
  if (!ratio) {
    return 0;
  }

  const [width, height] = ratio.split(':');
  return (height / width) * 100;
}

export const aspectRatios = [
  "1:1",
  "4:5",
  "16:9"
]

export const validAspectRatio = (aspectRatio) => {
  return aspectRatios.indexOf(aspectRatio) !== -1;
}

export const validLicenseDeclaration = (value) => {
  const values = [
    token,
    nonCommercial,
    commercial
  ]

  return values.indexOf(value) !== -1;
}

// TODO: Add a type for CloudinaryAssetType ('image' | 'video')
export const createCloudinaryUrl = (
  assetType = "image",
  deliveryType = "upload",
  transformations = null,
  folder,
  cid,
  ext = null
) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
  const environment = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER; // dev, staging, or prod

  return `https://res.cloudinary.com/${cloudName}/${assetType}/${deliveryType}/${transformations ? transformations + '/' : ''}${environment}/${folder}/${cid}${ext ? '.' + ext : ''}`;
}

// the sizes available across the site
export const srcSet = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1400, 1500];

export const getShortAddress = address => {
  return (address?.slice(0, 5) + '...' + address?.slice(-4)).toLowerCase();
}

export const ipfsUriToGatewayUrl = ipfsUri => {
  if (!ipfsUri) {
    return '#';
  }

  const [_protocol, uri] = ipfsUri.split('//');
  const [cid, path] = uri.split('/');


  if (path) {
    return `https://hodlmymoon.infura-ipfs.io/ipfs/${cid}/${path}`
  }

  return `https://hodlmymoon.infura-ipfs.io/ipfs/${cid}/`;
};

export const ipfsUriToCid = ipfsUri => {
  if (!ipfsUri) {
    return '#';
  }

  const [_protocol, uri] = ipfsUri.split('//');
  const [cid, _path] = uri.split('/');
  return `${cid}`
};

export const cidToGatewayUrl = cid => {
  if (!cid) {
    return '#';
  }

  return `https://hodlmymoon.infura-ipfs.io/ipfs/${cid}/`;
};

export const trim = str => {
  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

export const pluralize = (n: number, item: string) => {
  const v = n || 0;
  const endsWithY = item[item.length - 1] === 'y';
  return v !== 1 ? `${v} ${endsWithY ? item.slice(0, -1) + 'ies' : item + 's'}` : `1 ${item}`
}

export const validTxHashFormat = (addr) => {
  return /^0x([A-Fa-f0-9]{64})$/.test(addr);
}

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
}


export const assetTypeFromMimeType = (mimeType: string): AssetTypes | null => {
  if (!mimeType) {
    return null;
  }

  if (mimeType === 'image/gif') {
    return AssetTypes.Gif;
  }

  if (mimeType.indexOf('video') !== -1) {
    return AssetTypes.Video;
  }

  if (mimeType.indexOf('image') !== -1) {
    return AssetTypes.Image;
  }

  if (mimeType.indexOf('audio') !== -1) {
    return AssetTypes.Audio;
  }
}

export const getInfuraIPFSAuth = () => {
  const credentials = Buffer.from(process.env.INFURA_IPFS_PROJECT_ID + ':' + process.env.INFURA_IPFS_PROJECT_SECRET).toString('base64');
  var auth = { "Authorization": `Basic ${credentials}` };
  return auth;
};

export function delayForDemo(promise) {
  return new Promise(resolve => {
      setTimeout(resolve, 2000);
  }).then(() => promise);
}