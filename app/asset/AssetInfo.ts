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
  senderAddress?: string;

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

  send: (
    toChainId: number,
    receiver: string,
    ids: bigint[],
    amounts: bigint[],
  ) => Promise<void>;

  receive: (
    fromChainId: number,
    sendId: string,
    sender: string,
    ids: bigint[],
    amounts: bigint[],
    signature: string,
  ) => Promise<void>;
}
