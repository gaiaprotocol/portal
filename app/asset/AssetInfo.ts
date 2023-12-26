import BlockchainType from "../blockchain/BlockchainType.js";
import WalletManager from "../wallet/WalletManager.js";

export interface AssetMetadata {
  name: string;
  image: string;
}

export default interface AssetInfo {
  name: string;
  symbol: string;
  logo: string;
  addresses: { [chain: string]: string };
  senderAddress?: string;

  fetchMetadata?: (tokenId: string) => Promise<AssetMetadata>;
  fetchBalance: (
    chain: BlockchainType,
    wallet: WalletManager,
  ) => Promise<{ [tokenId: string]: bigint }>;

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
