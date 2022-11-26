import detectEthereumProvider from '@metamask/detect-provider'

export const getSigner = async () => {
  try {
    const { Web3Provider } = await import('@ethersproject/providers');

    const metamaskEthereumProvider = await detectEthereumProvider();

    const provider = new Web3Provider(metamaskEthereumProvider);
    
    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner()

    return signer;
  } catch (e) {
    alert(e.message)
  }
}
