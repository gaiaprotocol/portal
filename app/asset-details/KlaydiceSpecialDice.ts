import AssetInfo from "../asset/AssetInfo.js";
import BlockchainType from "../blockchain/BlockchainType.js";
import metadata from "./klaydice-special-dice-metadata.json" assert {
  type: "json",
};

const KlaydiceSpecialDice: AssetInfo = {
  name: "KLAYDICE - Special DICE NFT",
  symbol: "DICE",
  logo:
    "https://public.nftstatic.com/static/nft/webp/4721d0eadafc4b2e9c8ba869fb08db6d_400x400.webp",
  addresses: {
    [BlockchainType.BNB]: "0x1dDB2C0897daF18632662E71fdD2dbDC0eB3a9Ec",
    [BlockchainType.Bifrost]: "0xdf98e88944be3bc7C861135dAc617AD562EBB8D0",
  },
  fetchMetadata: async (tokenId: string) => {
    const data = metadata.find((m) => String(m.id) === tokenId);
    if (!data) {
      throw new Error(`Metadata not found for ${tokenId}`);
    }
    return { name: data.n, image: data.i };
  },
};

export default KlaydiceSpecialDice;
