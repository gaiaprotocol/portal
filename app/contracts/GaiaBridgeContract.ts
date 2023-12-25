import Contract from "./Contract.js";
import { GaiaBridge } from "./abi/gaiabridge/GaiaBridge.js";
import GaiaBridgeArtifact from "./abi/gaiabridge/GaiaBridge.json" assert {
  type: "json",
};

class GaiaBridgeContract extends Contract<GaiaBridge> {
  constructor() {
    super(GaiaBridgeArtifact.abi);
  }
}

export default new GaiaBridgeContract();
