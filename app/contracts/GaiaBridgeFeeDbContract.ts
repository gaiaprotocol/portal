import BlockchainType from "../blockchain/BlockchainType.js";
import WalletManager from "../wallet/WalletManager.js";
import Contract from "./Contract.js";
import { FeeDB } from "./abi/gaiabridge/FeeDB.js";
import GaiaBridgeFeeDbArtifact from "./abi/gaiabridge/FeeDB.json" assert {
  type: "json",
};

const addresses: { [chain: string]: string } = {
  [BlockchainType.Ethereum]: "0x38f5Bc161F5E1cBa86d82D5f0B11EA4ad40f07C7",
  [BlockchainType.Polygon]: "0xe7b16698ffe31B453F544Ee57063f60e4F94C8d8",
  [BlockchainType.BNB]: "0xd1a4964954785ddbC8C86a5412cE400f6E8d81D3",
  [BlockchainType.Klaytn]: "0xC53a3cB3d40d96C5f83A019C6D67B587927C62B7",
  [BlockchainType.Bifrost]: "0xd1a4964954785ddbC8C86a5412cE400f6E8d81D3",
};

export default class GaiaBridgeFeeDbContract extends Contract<FeeDB> {
  constructor(chain: BlockchainType, wallet: WalletManager) {
    super(GaiaBridgeFeeDbArtifact.abi, chain, addresses[chain], wallet);
  }
}
