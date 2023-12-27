import AssetInfo, { AssetMetadata } from "../asset/AssetInfo.js";
import AssetType from "../asset/AssetType.js";
import BlockchainType from "../blockchain/BlockchainType.js";
import NftUtilContract from "../contracts/NftUtilContract.js";
import Erc721Contract from "../contracts/standard/Erc721Contract.js";
import metadata from "./klaydice-special-dice-metadata.json" assert {
  type: "json"
};

const KlaydiceSpecialDice: AssetInfo = {
  type: AssetType.ERC721,
  name: "KLAYDICE - Special DICE NFT",
  symbol: "DICE",
  logo:
    "https://public.nftstatic.com/static/nft/webp/4721d0eadafc4b2e9c8ba869fb08db6d_400x400.webp",
  addresses: {
    [BlockchainType.BNB]: "0x1dDB2C0897daF18632662E71fdD2dbDC0eB3a9Ec",
    [BlockchainType.Bifrost]: "0xdf98e88944be3bc7C861135dAc617AD562EBB8D0",
  },

  fetchBalance: async (chain, wallet) => {
    const walletAddress = await wallet.getAddress();
    if (!walletAddress) return 0n;

    return await new Erc721Contract(
      chain,
      KlaydiceSpecialDice.addresses[chain],
      wallet,
    ).balanceOf(walletAddress);
  },

  fetchTokens: async (chain, wallet) => {
    const walletAddress = await wallet.getAddress();
    if (!walletAddress) return [];

    const tokenIds = await new NftUtilContract(chain, wallet).getTokenIds(
      KlaydiceSpecialDice.addresses[chain],
      walletAddress,
    );

    const result: {
      id: bigint;
      amount: bigint;
      metadata?: AssetMetadata;
    }[] = [];

    for (const id of tokenIds) {
      const m = metadata.find((m) => m.id === Number(id));
      result.push({
        id,
        amount: 1n,
        metadata: m
          ? {
            name: `Special DICE NFT - ${m.n}`,
            image: `https://public.nftstatic.com/static/nft/res/${m.i}.png`,
          }
          : undefined,
      });
    }
    return result;
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

export default KlaydiceSpecialDice;
