import { mainnet } from "@wagmi/core";
import { defineChain } from "viem";
import { bsc, klaytn, polygon } from "viem/chains";
import Env from "../Env.js";
import EvmWalletManager from "../wallet/EvmWalletManager.js";
import KlaytnWalletManager from "../wallet/KlaytnWalletManager.js";
import BlockchainInfo from "./BlockchainInfo.js";
import BlockchainType from "./BlockchainType.js";

const bifrost = defineChain({
  id: 3068,
  name: "Bifrost",
  network: "Bifrost",
  nativeCurrency: {
    decimals: 18,
    name: "Bifrost",
    symbol: "BFC",
  },
  rpcUrls: {
    default: { http: ["https://public-01.mainnet.thebifrost.io/rpc"] },
    public: { http: ["https://public-01.mainnet.thebifrost.io/rpc"] },
  },
  blockExplorers: {
    etherscan: {
      name: "BIFROST Network Explorer",
      url: "https://explorer.mainnet.thebifrost.io/",
    },
    default: {
      name: "BIFROST Network Explorer",
      url: "https://explorer.mainnet.thebifrost.io/",
    },
  },
  contracts: {},
});

export const viemChains = [mainnet, polygon, bsc, bifrost, klaytn];

const Blockchains: { [chain: string]: BlockchainInfo } = {
  [BlockchainType.Ethereum]: {
    chainId: Env.dev ? 1 : 1,
    rpc: Env.dev
      ? `https://mainnet.infura.io/v3/${Env.infuraKey}`
      : `https://mainnet.infura.io/v3/${Env.infuraKey}`,
    walletManager: EvmWalletManager,
  },
  [BlockchainType.Polygon]: {
    chainId: Env.dev ? 137 : 137,
    rpc: Env.dev
      ? polygon.rpcUrls.default.http[0]
      : polygon.rpcUrls.default.http[0],
    walletManager: EvmWalletManager,
  },
  [BlockchainType.BNB]: {
    chainId: Env.dev ? 56 : 56,
    rpc: Env.dev ? bsc.rpcUrls.default.http[0] : bsc.rpcUrls.default.http[0],
    walletManager: EvmWalletManager,
  },
  [BlockchainType.Bifrost]: {
    chainId: Env.dev ? 3068 : 3068,
    rpc: Env.dev
      ? bifrost.rpcUrls.default.http[0]
      : bifrost.rpcUrls.default.http[0],
    walletManager: EvmWalletManager,
  },
  [BlockchainType.Klaytn]: {
    chainId: Env.dev ? 8217 : 8217,
    rpc: Env.dev
      ? klaytn.rpcUrls.default.http[0]
      : klaytn.rpcUrls.default.http[0],
    walletManager: KlaytnWalletManager,
  },
};

export default Blockchains;
