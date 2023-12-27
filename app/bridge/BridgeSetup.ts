import BlockchainType from "../blockchain/BlockchainType.js";
import WalletManager from "../wallet/WalletManager.js";

export default interface BridgeSetup {
  asset?: string;
  fromChain?: BlockchainType;
  fromWallet?: WalletManager;
  fromWalletAddress?: string;
  toChain?: BlockchainType;
  toWallet?: WalletManager;
  toWalletAddress?: string;
}
