import type { Chain } from "@web3-onboard/common";
import { ConnectedChain } from "@web3-onboard/core";

export function isTestnet(chain: ConnectedChain | null): boolean {
  if (!chain) return false;
  return !["0xa4b1", "0xa"].includes(chain.id);
}

type SupportedChain = Chain & { network: "mainnet" | "testnet"; icon: string };

export const supportedChains: SupportedChain[] = [
  {
    network: "mainnet",
    icon: "/assets/ARB.png",
    id: "0xa4b1",
    token: "ETH",
    label: "Arbitrum One",
    rpcUrl: "https://arbitrum-one.publicnode.com",
  },
  {
    network: "mainnet",
    icon: "/assets/OP.png",
    id: "0xa",
    token: "ETH",
    label: "OP Mainnet",
    rpcUrl: "https://mainnet.optimism.io",
  },
  {
    network: "mainnet",
    icon: "/assets/BASE_LOGO.png",
    id: "0x2105",
    token: "ETH",
    label: "Base",
    rpcUrl: "https://base-rpc.publicnode.com",
  },
  {
    network: "testnet",
    icon: "/assets/arbitrum_sepolia.svg",
    id: "0x66eee",
    token: "ETH",
    label: "Arbitrum Sepolia",
    rpcUrl: "https://arbitrum-sepolia.publicnode.com",
  },
  {
    network: "testnet",
    icon: "/assets/optimism_sepolia.svg",
    id: "0xaa37dc",
    token: "ETH",
    label: "OP Sepolia",
    rpcUrl: "https://optimism-sepolia.publicnode.com",
  },
  {
    network: "testnet",
    icon: "/assets/base_sepolia.svg",
    id: "0x14a34",
    token: "ETH",
    label: "Base Sepolia",
    rpcUrl: "https://base-sepolia-rpc.publicnode.com",
  },
];

export const supportedChainIds = supportedChains.map(({ id }) => Number(id));

export type ChainsImageType = 1 | 56 | 324 | 137 | 534352 | 59144;
const chainsImage = {
  1: "/assets/ETH.png",
  42161: "/assets/ETH.png",
  56: "/assets/BSC.png",
  324: "/assets/ZK.png",
  137: "/assets/MATIC.png",
  534352: "/assets/SCROLL.png",
  59144: "/assets/LINEA.png",
};

export const getImageFromChainId = (id: ChainsImageType): string => {
  return chainsImage[id];
};
