import Contract from "./Contract.js";
import { WrappedInjeolmi } from "./abi/injeolmi/WrappedInjeolmi.js";
import WrappedInjeolmiArtifact from "./abi/injeolmi/WrappedInjeolmi.json" assert {
  type: "json",
};

class WrappedInjeolmiContract extends Contract<WrappedInjeolmi> {
  constructor() {
    super(WrappedInjeolmiArtifact.abi);
  }
}

export default new WrappedInjeolmiContract();
