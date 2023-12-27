import Mix from "../asset-details/Mix.js";
import BlockchainType from "../blockchain/BlockchainType.js";
import WalletManager from "../wallet/WalletManager.js";
import Contract from "./Contract.js";
import { MixSender } from "./abi/mix/MixSender.js";
import MixSenderArtifact from "./abi/mix/MixSender.json" assert {
  type: "json"
};

export default class MixSenderContract extends Contract<MixSender> {
  constructor(chain: BlockchainType, wallet: WalletManager) {
    super(MixSenderArtifact.abi, chain, Mix.senderAddresses[chain], wallet);
  }
}
