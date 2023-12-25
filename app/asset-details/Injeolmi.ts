import AssetInfo from "../asset/AssetInfo.js";
import BlockchainType from "../blockchain/BlockchainType.js";

const Injeolmi: AssetInfo = {
  name: "Injeolmi",
  symbol: "IJM",
  logo: "/images/asset-logos/injeolmi.png",
  addresses: {
    [BlockchainType.Klaytn]: "0x0268dbed3832b87582B1FA508aCF5958cbb1cd74",
    [BlockchainType.Ethereum]: "0xBeA76c71929788Ab20e17759eaC115798F9aEf27",
    [BlockchainType.Polygon]: "0x9b23804ede399ebf86612b560Ac0451f1448185a",
    [BlockchainType.BNB]: "0xf258F061aE2D68d023eA6e7Cceef97962785c6c1",
  },
};

export default Injeolmi;
