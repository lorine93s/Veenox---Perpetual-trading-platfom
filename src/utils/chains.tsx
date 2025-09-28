type Chain = {
  id: number;
  name: string;
  network: string;
  nativeCurrency: {
    decimals: number;
    name: string;
    symbol: string;
  };
  rpcUrls: {
    default: {
      http: string[];
    };
    public: {
      http: string[];
    };
  };
  blockExplorers: {
    default: { name: string; url: string };
  };
  testnet: boolean;
};

export const bnbChain: Chain = {
  id: 56,
  name: "BNB Smart Chain (BEP20)",
  network: "bnb",
  nativeCurrency: {
    decimals: 18,
    name: "BNB",
    symbol: "BNB",
  },
  rpcUrls: {
    default: {
      http: ["https://bsc-dataseed.binance.org"],
    },
    public: {
      http: ["https://bsc-dataseed.binance.org"],
    },
  },
  blockExplorers: {
    default: { name: "BSCScan", url: "https://bscscan.com" },
  },
  testnet: false,
};

export const polygon: Chain = {
  id: 137,
  name: "Polygon",
  network: "polygon",
  nativeCurrency: {
    decimals: 18,
    name: "Polygon",
    symbol: "MATIC",
  },
  rpcUrls: {
    default: {
      http: ["https://polygon-rpc.com" as any],
    },
    public: {
      http: ["https://polygon-rpc.com" as any],
    },
  },
  blockExplorers: {
    default: { name: "PolygonScan", url: "https://polygonscan.com" },
  },
  testnet: false,
};

export const ethereum: Chain = {
  id: 1,
  name: "Ethereum",
  network: "ethereum",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: [
        "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161" as any,
      ],
    },
    public: {
      http: [
        "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161" as any,
      ],
    },
  },
  blockExplorers: {
    default: { name: "Etherscan", url: "https://etherscan.io" },
  },
  testnet: false,
};

export const arbitrum: Chain = {
  id: 42161,
  name: "Arbitrum",
  network: "arbitrum",
  nativeCurrency: {
    decimals: 18,
    name: "Arbitrum",
    symbol: "ARB",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.ankr.com/arbitrum" as any],
    },
    public: {
      http: ["https://rpc.ankr.com/arbitrum" as any],
    },
  },
  blockExplorers: {
    default: { name: "ArbitrumScan", url: "https://arbiscan.io" },
  },
  testnet: false,
};

export const optimism: Chain = {
  id: 10,
  name: "Optimism",
  network: "optimism",
  nativeCurrency: {
    decimals: 18,
    name: "Optimism",
    symbol: "OP",
  },
  rpcUrls: {
    default: {
      http: ["https://mainnet.optimism.io" as any],
    },
    public: {
      http: ["https://mainnet.optimism.io" as any],
    },
  },
  blockExplorers: {
    default: { name: "OptimismScan", url: "https://optimistic.etherscan.io" },
  },
  testnet: false,
};

export const base: Chain = {
  id: 8453,
  name: "Base",
  network: "base",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://mainnet.base.org	" as any],
    },
    public: {
      http: ["https://mainnet.base.org	" as any],
    },
  },
  blockExplorers: {
    default: { name: "BaseScan", url: "https://www.basescan.org" },
  },
  testnet: false,
};

export const idToWagmiChain: Record<number, Chain> = {
  1: ethereum,
  10: optimism,
  137: polygon,
  42161: arbitrum,
  56: bnbChain,
  8453: base,
};
