import { 
  getAccount, 
  connect as _connect, 
  fetchSigner, 
  createClient, 
  configureChains
 } from '@wagmi/core'

import { 
  polygon, 
  polygonMumbai 
} from '@wagmi/core/chains'

import { 
  MetaMaskConnector 
} from '@wagmi/core/connectors/metaMask'

import { 
  publicProvider
} from '@wagmi/core/providers/public'

const { chains, provider, webSocketProvider } = configureChains(
  [polygon, polygonMumbai],
  [publicProvider()],
)
 
const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors: [
    new MetaMaskConnector({ 
      chains, 
      options: {
        shimDisconnect: true,
        shimChainChangedDisconnect: false,
        // UNSTABLE_shimOnConnectSelectAccount: true,
      }
    }),
  ]
})


export const getSigner = async () => {
  const { isDisconnected } = getAccount();

  if (isDisconnected) {
    const result = await _connect({
      chainId: polygon.id,
      connector: new MetaMaskConnector({
        chains: [polygon, polygonMumbai],
        options: {
          shimDisconnect: true,
          shimChainChangedDisconnect: false,
          UNSTABLE_shimOnConnectSelectAccount: true,
        }
      }),
    });
  }

  return await fetchSigner();
}
