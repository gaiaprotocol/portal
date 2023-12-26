import WalletManager from "../wallet/WalletManager.js";

export default interface BlockchainInfo {
  chainId: number;
  rpc: string;
  blockExplorer: {
    name: string;
    url: string;
  };
  walletManager: WalletManager;
}
