
// a list of chains we suppport
export const chains = {
    polygon: {
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
    mumbai: {
        chainId: '0x13881', //'0x89',
        chainName: 'Polygon Mumbai',
        rpcUrls: ["https://polygon-mumbai.infura.io"],
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18
        },
        blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
    },

}