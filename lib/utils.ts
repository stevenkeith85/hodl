import memoize from 'memoizee';

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