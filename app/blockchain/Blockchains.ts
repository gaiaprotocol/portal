import { bsc, klaytn, mainnet, polygon } from "viem/chains";
import Env from "../Env.js";
import EvmWalletManager, { bifrost } from "../wallet/EvmWalletManager.js";
import KlaytnWalletManager from "../wallet/KlaytnWalletManager.js";
import BlockchainInfo from "./BlockchainInfo.js";
import BlockchainType from "./BlockchainType.js";

export function initBlockchains() {
  Blockchains[BlockchainType.Ethereum].rpc =
    `https://mainnet.infura.io/v3/${Env.infuraKey}`;
}

const Blockchains: { [chain: string]: BlockchainInfo } = {
  [BlockchainType.Ethereum]: {
    chainId: 1,
    rpc: "", // set in initBlockchains()
    blockExplorer: mainnet.blockExplorers.default,
    walletManager: EvmWalletManager,
  },
  [BlockchainType.Polygon]: {
    chainId: 137,
    rpc: polygon.rpcUrls.default.http[0],
    blockExplorer: polygon.blockExplorers.default,
    walletManager: EvmWalletManager,
  },
  [BlockchainType.BNB]: {
    chainId: 56,
    rpc: bsc.rpcUrls.default.http[0],
    blockExplorer: bsc.blockExplorers.default,
    walletManager: EvmWalletManager,
  },
  [BlockchainType.Bifrost]: {
    chainId: 3068,
    rpc: bifrost.rpcUrls.default.http[0],
    blockExplorer: bifrost.blockExplorers.default,
    walletManager: EvmWalletManager,
  },
  [BlockchainType.Klaytn]: {
    chainId: 8217,
    rpc: "https://public-en-cypress.klaytn.net",
    blockExplorer: klaytn.blockExplorers.default,
    walletManager: KlaytnWalletManager,
  },
};

export default Blockchains;
