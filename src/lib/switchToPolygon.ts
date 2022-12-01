import { chains } from "./chains";

export const switchToPolygon = async (provider) => {
    if (!provider) {
        console.log("No provider!")
    }
    try {
        // @ts-ignore
        await provider.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' ? chains.mumbai.chainId: chains.polygon.chainId}],
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            // @ts-ignore
            await provider.provider.request({
              method: 'wallet_addEthereumChain',
              params: [ process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' ? chains.mumbai: chains.polygon ],
            });
          } catch (addError) {
            console.log(addError);
          }
        } else {
            console.log(switchError);
        }
      }
}
