import Injeolmi from "../asset-details/Injeolmi.js";
import BlockchainType from "../blockchain/BlockchainType.js";
import WalletManager from "../wallet/WalletManager.js";
import Contract from "./Contract.js";
import { WrappedInjeolmi } from "./abi/injeolmi/WrappedInjeolmi.js";
import WrappedInjeolmiArtifact from "./abi/injeolmi/WrappedInjeolmi.json" assert {
  type: "json"
};

export default class WrappedInjeolmiContract extends Contract<WrappedInjeolmi> {
  constructor(chain: BlockchainType, wallet: WalletManager) {
    super(
      WrappedInjeolmiArtifact.abi,
      chain,
      Injeolmi.addresses[chain],
      wallet,
    );
  }
}
