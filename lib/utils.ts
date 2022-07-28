import { Typography } from "@mui/material";
import Link from "next/link";
import { AssetTypes } from "../models/AssetType";
import { Nft } from "../models/Nft";
import { Token } from "../models/Token";
import { commercial, nonCommercial, token } from "./copyright";

export const TAG_PATTERN = /#([\d\w_]+)/g;
export const MAX_TAGS_PER_TOKEN = 6;

export const addLinksToTags = text => {
   return text.replace(TAG_PATTERN, (a, b) => {
    return `<Link href="/search?q=${b}"><a>${a}</a></Link>`
  });
}


export const getAsString = param => Array.isArray(param) ? param[0] : param;

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const hasExpired = jwt => {
  if (!jwt) {
    return true;
  }
  
  return Date.now() >= (JSON.parse(atob(jwt.split('.')[1]))).exp * 1000
}

export const imageFilters = [
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

export const imageSizes = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1400, 1500];

export const getShortAddress = address => {
  return address?.slice(0, 5) + '...' + address?.slice(-4);
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
    return `https://${cid}.ipfs.infura-ipfs.io/${path}`;
  }

  return `https://${cid}.ipfs.infura-ipfs.io`;
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

  return `https://${cid}.ipfs.infura-ipfs.io`;
};

export const trim = str => {
  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
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

export const messageToSign = `
Welcome to HodlMyMoon. 

To log in to the website, please sign this message. 

It will NOT cost you a transaction fee. 

Nonce: `
