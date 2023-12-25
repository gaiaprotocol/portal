import Contract from "./Contract.js";
import { InjeolmiSender } from "./abi/injeolmi/InjeolmiSender.js";
import InjeolmiSenderArtifact from "./abi/injeolmi/InjeolmiSender.json" assert {
  type: "json",
};

class InjeolmiSenderContract extends Contract<InjeolmiSender> {
  constructor() {
    super(InjeolmiSenderArtifact.abi);
  }
}

export default new InjeolmiSenderContract();
