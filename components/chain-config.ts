export const WORLD_CHAIN_SEPOLIA = {
  id: 4801,
  name: 'World Chain Sepolia',
  network: 'worldchain-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://worldchain-sepolia.drpc.org'],
    },
    public: {
      http: ['https://worldchain-sepolia.drpc.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'World Chain Sepolia Explorer',
      url: 'https://explorer.worldchain.org',
    },
  },
} as const;

export const DEPLOYMENT_CONFIG = {
  chainId: 4801,
  rpcUrl: 'https://worldchain-sepolia.drpc.org',
  explorerUrl: 'https://explorer.worldchain.org',
  gasLimit: 500000,
  gasPrice: '20000000000', // 20 gwei
}; 