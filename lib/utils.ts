export const hasExpired = jwt => Date.now() >= (JSON.parse(atob(jwt.split('.')[1]))).exp * 1000

export const makeAddressBasedFetcher = key => (url, address) => fetch(`${url}?address=${address}`)
                                                                .then(r => r.json())
                                                                .then(json => json[key])

export const imageFilters = [
  {code:null, name: 'original'}, 
  {code:"e_improve", name:'improve'}, 
  {code:"e_art:athena", name: 'athena'}, 
  {code:"e_art:aurora", name: 'aurora'}, 
  {code:"e_art:hairspray", name: 'hairspray'},
  {code:"e_grayscale", name: 'greyscale'}
  ];

export const createCloudinaryUrl = (assetType="image", deliveryType="upload", transformations=null, folder, cid, ext=null) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
  const environment = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER; // dev, staging, or prod
  
  return `https://res.cloudinary.com/${cloudName}/${assetType}/${deliveryType}/${ transformations ? transformations + '/' : ''}${environment}/${folder}/${cid}${ext ? '.' + ext: ''}`;
}

export const imageSizes = [400, 600, 800, 1000, 1200, 1400, 1600];

export const checkForAndDisplaySmartContractErrors = (error, snackbarRef) => {
    if (error.code === -32603) { // Smart Contract Error Messages
      const re = /reverted with reason string '(.+)'/gi;
      const matches = re.exec(error.data.message)

      if (matches) {
        // @ts-ignore
        snackbarRef?.current?.display(matches[1], 'error');
      }

      console.log(error)
    }
}

export const getShortAddress = address => {
    return address?.slice(0, 2) + '..' + address?.slice(-4);
}

export const truncateText = (text, length=30) => {
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

export const ipfsUriToCloudinaryUrl = ipfsUri => {
    if (!ipfsUri) {
      return '#';
    }
  
    const [_protocol, uri] = ipfsUri.split('//');
    const [cid, _path] = uri.split('/');
    return `${cid}`
};

export const trim = str  => {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}
  
export const assetType = nft => {
  if (!nft.mimeType) {
      return 'image';
  }

  if (nft.mimeType === 'image/gif') {
      return 'gif'
  }
  
  if (nft.mimeType.indexOf('video') !== -1) {
      return 'video'
  }

  if (nft.mimeType.indexOf('image') !== -1) {
      return 'image'
  }
}

export const messageToSign = `
Welcome to HodlMyMoon. 

To log in to the website, please sign this message. 

It will NOT cost you a transaction fee. 

Nonce: `