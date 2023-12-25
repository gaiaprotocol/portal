export interface AssetMetadata {
  name: string;
  image: string;
}

export default interface AssetInfo {
  name: string;
  symbol: string;
  logo: string;
  addresses: {
    [chain: string]: string;
  };
  fetchMetadata?: (tokenId: string) => Promise<AssetMetadata>;
}
