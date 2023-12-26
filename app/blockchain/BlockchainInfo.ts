import WalletManager from "../wallet/WalletManager.js";

export default interface BlockchainInfo {
  chainId: number;
  rpc: string;
  walletManager: WalletManager;
}
