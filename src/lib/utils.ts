import { AssetTypes } from "../models/AssetType";
import { commercial, nonCommercial, token } from "./copyright";

export const TAG_PATTERN = /#([\d\w_]{3,25})(\s|$)/g;
export const MAX_TAGS_PER_TOKEN = 6;

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

export const ipfsUriToGatewayUrl = ipfsUri => {
  if (!ipfsUri) {
    return '#';
  }

  const [_protocol, uri] = ipfsUri.split('//');
  const [cid, path] = uri.split('/');


  if (path) {
    return `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${cid}/${path}`
  }

  return `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${cid}/`;
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

  return `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${cid}/`;
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
    setTimeout(resolve, 5000);
  }).then(() => promise);
}


// unicode escape all non-ascii and non-visible characters.
//
// The unicode astral plane caused us issues. i.e. emojis.
//
// We just stored whatever the UI gave us and that seemed to cause an issue when we tried a JSON parse of what we got back from redis.
//
// Things seem much more reliable when we escape the characters.
//
// See here for general info:
// https://stackoverflow.com/a/64401147
// https://dmitripavlutin.com/what-every-javascript-developer-should-know-about-unicode/#:~:text=Surrogate%20pair%20is%20a%20representation,code%20units%20%E2%80%94%20a%20surrogate%20pair.
export function jsonEscapeUTF(s) {
  let result = s.replace(/[^\x20-\x7F]/g, x => "\\u" + ("000" + x.codePointAt(0).toString(16)).slice(-4))
  return result;
}


// We use a combination here; as I personally have a touch screen laptop; so I don't think thats a good enough check
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent#considerations_before_using_browser_detection
export const isMobileDevice = () => {
  const UA = navigator.userAgent;

  let hasTouchScreen = false;
  let hasMobileUA = false;

  if ("maxTouchPoints" in navigator) {
    hasTouchScreen = navigator.maxTouchPoints > 0;
  } else if ("msMaxTouchPoints" in navigator) {
    // @ts-ignore
    hasTouchScreen = navigator.msMaxTouchPoints > 0;
  } else {
    const mQ = window.matchMedia && matchMedia("(pointer:coarse)");
    if (mQ && mQ.media === "(pointer:coarse)") {
      hasTouchScreen = !!mQ.matches;
    } else if ('orientation' in window) {
      hasTouchScreen = true; // deprecated, but good fallback
    }
  }

  hasMobileUA = (
    /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
    /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
  );

  return hasTouchScreen && hasMobileUA;
}