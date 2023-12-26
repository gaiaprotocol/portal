import AssetInfo from "../asset/AssetInfo.js";
import BlockchainType from "../blockchain/BlockchainType.js";

const Mix: AssetInfo = {
  name: "DSC Mix",
  symbol: "MIX",
  logo: "/images/asset-logos/mix.png",
  addresses: {
    [BlockchainType.Klaytn]: "0xDd483a970a7A7FeF2B223C3510fAc852799a88BF",
    [BlockchainType.Ethereum]: "0x5DB69B9f173f9D9FA91b7cDCc4Dc9939C0499CFe",
    [BlockchainType.Polygon]: "0x5085a6879Af6767732c51CA0fc7422d41d9aAEf6",
  },

  send: async (
    toChainId: number,
    receiver: string,
    ids: bigint[],
    amounts: bigint[],
  ) => {
    //TODO: implement
  },

  receive: async (
    fromChainId: number,
    sendId: string,
    sender: string,
    ids: bigint[],
    amounts: bigint[],
    signature: string,
  ) => {
    //TODO: implement
  },
};

export default Mix;
