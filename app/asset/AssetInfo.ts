import BlockchainType from "../blockchain/BlockchainType.js";
import WalletManager from "../wallet/WalletManager.js";
import AssetType from "./AssetType.js";

export interface AssetMetadata {
  name: string;
  image: string;
}

export default interface AssetInfo {
  type: AssetType;
  name: string;
  symbol: string;
  decimals?: number;
  logo: string;

  addresses: { [chain: string]: string };
  senderAddresses: { [chain: string]: string };

  fetchBalance: (
    chain: BlockchainType,
    wallet: WalletManager,
  ) => Promise<bigint>;

  fetchTokens: (
    chain: BlockchainType,
    wallet: WalletManager,
  ) => Promise<{
    id: bigint;
    amount: bigint;
    metadata?: AssetMetadata;
  }[]>;

  checkApprovalToSender: (
    chain: BlockchainType,
    wallet: WalletManager,
    amounts: { [tokenId: string]: bigint },
  ) => Promise<boolean>;

  approveToSender: (
    chain: BlockchainType,
    wallet: WalletManager,
    amounts: { [tokenId: string]: bigint },
  ) => Promise<void>;

  send: (
    chain: BlockchainType,
    wallet: WalletManager,
    toChain: BlockchainType,
    receiver: string,
    amounts: { [tokenId: string]: bigint },
  ) => Promise<bigint | undefined>;

  receive: (
    chain: BlockchainType,
    wallet: WalletManager,
    fromChain: BlockchainType,
    sender: string,
    sendingId: bigint,
    amounts: { [tokenId: string]: bigint },
  ) => Promise<void>;
}
