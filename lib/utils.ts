
export const checkForAndDisplaySmartContractErrors = (error, snackbarRef) => {
    if (error.code === -32603) { // Smart Contract Error Messages
      const re = /reverted with reason string '(.+)'/gi;
      const matches = re.exec(error.data.message)
      // @ts-ignore
      snackbarRef?.current?.display(matches[1], 'error');
    }
  }

export const getShortAddress = (address) => {
    return address?.slice(0, 2) + '..' + address?.slice(-4);
}