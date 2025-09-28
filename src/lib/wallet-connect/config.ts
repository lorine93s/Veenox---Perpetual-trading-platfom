import { createConfig, http } from "wagmi";
import {
  arbitrum,
  arbitrumSepolia,
  base,
  bsc,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";

const chains = [
  mainnet,
  sepolia,
  arbitrum,
  optimism,
  base,
  polygon,
  bsc,
  arbitrumSepolia,
] as const;
export const config = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
});
