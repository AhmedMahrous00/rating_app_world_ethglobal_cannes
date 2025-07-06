import { createConfig, http } from '@wagmi/core';
import { sepolia, optimism } from '@wagmi/core/chains';

const worldChainMainnet = {
  id: 480,
  name: 'World Chain Mainnet',
  network: 'worldchain-mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://worldchain.drpc.org'],
    },
    public: {
      http: ['https://worldchain.drpc.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'World Chain Explorer',
      url: 'https://explorer.worldchain.org',
    },
  },
} as const;

export const config = createConfig({
  chains: [worldChainMainnet, sepolia, optimism],
  transports: {
    [worldChainMainnet.id]: http(),
    [sepolia.id]: http(),
    [optimism.id]: http(),
  },
});
