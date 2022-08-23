import { AssetTypes } from "../models/AssetType";
import { Nft } from "../models/Nft";
import { Token } from "../models/Token";
import { commercial, nonCommercial, token } from "./copyright";

export const TAG_PATTERN = /#([\d\w_]+)/g;
export const MAX_TAGS_PER_TOKEN = 6;
export const NUMBER_OF_CONFIRMATIONS_TO_WAIT_FOR = 1; // we only get one confirmation with our local node; so leave it at that for the moment

export const chunk = (input, size) => {
  return input.reduce((arr, item, idx) => {
    return idx % size === 0
      ? [...arr, [item]]
      : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
  }, []);
};

export const getAsString = (param) : string | null => Array.isArray(param) ? param[0] : param;

export const imageFilters: {
  code: "e_improve" | "e_art:athena" | "e_art:aurora" | "e_art:hairspray" | "e_grayscale"
  name: string;
} [] = [
  { code: null, name: 'original' },
  { code: "e_improve", name: 'improve' },
  { code: "e_art:athena", name: 'athena' },
  { code: "e_art:aurora", name: 'aurora' },
  { code: "e_art:hairspray", name: 'hairspray' },
  { code: "e_grayscale", name: 'greyscale' }
];

export const validFilter = (filter) => {
  const codes = imageFilters.map(f => f.code);

  return codes.find(code => code === filter);
}

export const aspectRatios = [
  null,
  "1:1",
  "4:5",
  "16:9"
]

export const validAspectRatio = (aspectRatio) => {
  return aspectRatios.indexOf(aspectRatio) !== -1;
}

export const validPrivilegeValue = (value) => {
  const values = [
    token,
    nonCommercial,
    commercial
  ]

  return values.indexOf(value) !== -1;
}

// TODO: Add a type for CloudinaryAssetType ('image' | 'video')
export const createCloudinaryUrl = (assetType = "image", deliveryType = "upload", transformations = null, folder, cid, ext = null) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
  const environment = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER; // dev, staging, or prod

  return `https://res.cloudinary.com/${cloudName}/${assetType}/${deliveryType}/${transformations ? transformations + '/' : ''}${environment}/${folder}/${cid}${ext ? '.' + ext : ''}`;
}

// the sizes available across the site
export const srcSet = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1400, 1500];

export const getShortAddress = address => {
  return (address?.slice(0, 5) + '...' + address?.slice(-4)).toLowerCase();
}

export const truncateText = (text, length = 30) => {
  if (!text) {
    return '';
  }

  if (text.length > length) {
    return text.slice(0, length) + '...';
  }

  return text;
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
  return v !== 1 ? `${v} ${endsWithY ? item.slice(0, -1) + 'ies' : item + 's'}`: `1 ${item}`
}

export const assetType = (nft: Token | Nft) : AssetTypes => {
  if (!nft.mimeType) {
    return AssetTypes.Image;
  }

  if (nft.mimeType === 'image/gif') {
    return AssetTypes.Gif;
  }

  if (nft.mimeType.indexOf('video') !== -1) {
    return AssetTypes.Video;
  }

  if (nft.mimeType.indexOf('image') !== -1) {
    return AssetTypes.Image;
  }

  if (nft.mimeType.indexOf('audio') !== -1) {
    return AssetTypes.Audio;
  }
}

export const messageToSign = `Welcome to HodlMyMoon!

To connect, please sign this message. 

This request will not trigger a blockchain transaction or cost any gas fees.

Nonce:
`