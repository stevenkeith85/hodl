
// FE only
export const switchToPolygon = async (provider) => {
    if (!provider) {
        alert("Not connected");
        return;
    }

    try {
        // @ts-ignore
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x89' }],
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            // @ts-ignore
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x89',
                  chainName: 'Polygon Mainnet',
                  rpcUrls: ["https://polygon-mainnet.infura.io"],
                  nativeCurrency: {
                    name: "MATIC",
                    symbol: "MATIC",
                    decimals: 18
                  },
                  blockExplorerUrls: ["https://polygonscan.com/"]
                },
              ],
            });
          } catch (addError) {
            alert(addError);
          }
        } else {
            alert(switchError);
        }
      }
}
