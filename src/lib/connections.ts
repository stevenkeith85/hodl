export const getSigner = async () => {
  try {

  
  const { Web3Provider } = await import('@ethersproject/providers');

  // @ts-ignore
  if (window?.ethereum) {
    alert("window.ethereum is available")
  } else {
    alert("window.ethereum is not available")
  }
  
  // A Web3Provider wraps a standard Web3 provider, which is
  // what MetaMask injects as window.ethereum into each page
  // @ts-ignore
  const provider = new Web3Provider(window.ethereum)

  // MetaMask requires requesting permission to connect users accounts
  const addresses = await provider.send("eth_requestAccounts", []);

  alert(JSON.stringify(addresses))
  // The MetaMask plugin also allows signing transactions to
  // send ether and pay to change state within the blockchain.
  // For this, you need the account signer...
  const signer = provider.getSigner()

  return signer;
} catch(e) {
  alert(e.message)
}
}
