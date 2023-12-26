import AssetInfo from "../asset/AssetInfo.js";
import AssetType from "../asset/AssetType.js";
import BlockchainType from "../blockchain/BlockchainType.js";
import Erc20Contract from "../contracts/Erc20Contract.js";

const Mix: AssetInfo = {
  type: AssetType.ERC20,
  name: "DSC Mix",
  symbol: "MIX",
  decimals: 18,
  logo: "/images/asset-logos/mix.png",

  addresses: {
    [BlockchainType.Klaytn]: "0xDd483a970a7A7FeF2B223C3510fAc852799a88BF",
    [BlockchainType.Ethereum]: "0x5DB69B9f173f9D9FA91b7cDCc4Dc9939C0499CFe",
    [BlockchainType.Polygon]: "0x5085a6879Af6767732c51CA0fc7422d41d9aAEf6",
  },
  senderAddress: "0xDeE2b8539c2321450a99f6728633DEf8d069262F",

  fetchTokens: async (chain, wallet) => {
    const walletAddress = await wallet.getAddress();
    if (!walletAddress) return [{ id: 0n, amount: 0n }];

    const balance = await new Erc20Contract(
      chain,
      Mix.addresses[chain],
      wallet,
    ).balanceOf(walletAddress);

    return [{ id: 0n, amount: balance }];
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
