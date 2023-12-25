import Contract from "./Contract.js";
import { MixSender } from "./abi/mix/MixSender.js";
import MixSenderArtifact from "./abi/mix/MixSender.json" assert {
  type: "json",
};

class MixSenderContract extends Contract<MixSender> {
  constructor() {
    super(MixSenderArtifact.abi);
  }
}

export default new MixSenderContract();
