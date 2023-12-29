import BlockchainType from "../blockchain/BlockchainType.js";
import WalletManager from "../wallet/WalletManager.js";

export default interface BridgeSetup {
  asset?: string;
  fromChain?: BlockchainType;
  fromWallet?: WalletManager;
  sender?: string;
  toChain?: BlockchainType;
  toWallet?: WalletManager;
  receiver?: string;
}
