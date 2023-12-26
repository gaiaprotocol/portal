import { bsc, klaytn, mainnet, polygon } from "viem/chains";
import Env from "../Env.js";
import EvmWalletManager, { bifrost } from "../wallet/EvmWalletManager.js";
import KlaytnWalletManager from "../wallet/KlaytnWalletManager.js";
import BlockchainInfo from "./BlockchainInfo.js";
import BlockchainType from "./BlockchainType.js";

const Blockchains: { [chain: string]: BlockchainInfo } = {
  [BlockchainType.Ethereum]: {
    chainId: Env.dev ? 1 : 1,
    rpc: Env.dev
      ? `https://mainnet.infura.io/v3/${Env.infuraKey}`
      : `https://mainnet.infura.io/v3/${Env.infuraKey}`,
    blockExplorer: mainnet.blockExplorers.default,
    walletManager: EvmWalletManager,
  },
  [BlockchainType.Polygon]: {
    chainId: Env.dev ? 137 : 137,
    rpc: Env.dev
      ? polygon.rpcUrls.default.http[0]
      : polygon.rpcUrls.default.http[0],
    blockExplorer: polygon.blockExplorers.default,
    walletManager: EvmWalletManager,
  },
  [BlockchainType.BNB]: {
    chainId: Env.dev ? 56 : 56,
    rpc: Env.dev ? bsc.rpcUrls.default.http[0] : bsc.rpcUrls.default.http[0],
    blockExplorer: bsc.blockExplorers.default,
    walletManager: EvmWalletManager,
  },
  [BlockchainType.Bifrost]: {
    chainId: Env.dev ? 3068 : 3068,
    rpc: Env.dev
      ? bifrost.rpcUrls.default.http[0]
      : bifrost.rpcUrls.default.http[0],
    blockExplorer: bifrost.blockExplorers.default,
    walletManager: EvmWalletManager,
  },
  [BlockchainType.Klaytn]: {
    chainId: Env.dev ? 8217 : 8217,
    rpc: Env.dev
      ? klaytn.rpcUrls.default.http[0]
      : klaytn.rpcUrls.default.http[0],
    blockExplorer: klaytn.blockExplorers.default,
    walletManager: KlaytnWalletManager,
  },
};

export default Blockchains;
