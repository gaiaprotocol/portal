import Injeolmi from "../asset-details/Injeolmi.js";
import BlockchainType from "../blockchain/BlockchainType.js";
import WalletManager from "../wallet/WalletManager.js";
import Contract from "./Contract.js";
import { InjeolmiSender } from "./abi/injeolmi/InjeolmiSender.js";
import InjeolmiSenderArtifact from "./abi/injeolmi/InjeolmiSender.json" assert {
  type: "json"
};

export default class InjeolmiSenderContract extends Contract<InjeolmiSender> {
  constructor(chain: BlockchainType, wallet: WalletManager) {
    super(InjeolmiSenderArtifact.abi, chain, Injeolmi.senderAddress!, wallet);
  }
}
