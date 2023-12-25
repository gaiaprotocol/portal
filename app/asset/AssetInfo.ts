export interface AssetMetadata {
  name: string;
  image: string;
}

export default interface AssetInfo {
  name: string;
  symbol: string;
  logo: string;
  addresses: { [chain: string]: string };

  fetchMetadata?: (tokenId: string) => Promise<AssetMetadata>;

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
