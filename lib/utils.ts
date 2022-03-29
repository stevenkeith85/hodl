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

export const getShortAddress = memoize((address) => {
    return address?.slice(0, 2) + '..' + address?.slice(-4);
})

export const truncateText = memoize((text, length=30) => {
    if (!text) {
        return '';
    }

    if (text.length > length) {
        return text.slice(0, length) + '...';
    }

    return text;
})

export const ipfsUriToGatewayUrl = memoize(ipfsUri => {
    if (!ipfsUri) {
      return '#';
    }
  
    const [_protocol, uri] = ipfsUri.split('//');
    const [cid, path] = uri.split('/');
  
    if (path) {
      return `https://${cid}.ipfs.infura-ipfs.io/${path}`;
    }
  
    return `https://${cid}.ipfs.infura-ipfs.io`;
  
});

export const ipfsUriToCloudinaryUrl = memoize(ipfsUri => {
    if (!ipfsUri) {
      return '#';
    }
  
    const [_protocol, uri] = ipfsUri.split('//');
    const [cid, _path] = uri.split('/');
    return `${cid}`
});

export const trim =(str)  => {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}
  