import Contract from "./Contract.js";
import { FeeDB } from "./abi/gaiabridge/FeeDB.js";
import GaiaBridgeFeeDbArtifact from "./abi/gaiabridge/FeeDB.json" assert {
  type: "json",
};

class GaiaBridgeFeeDbContract extends Contract<FeeDB> {
  constructor() {
    super(GaiaBridgeFeeDbArtifact.abi);
  }
}

export default new GaiaBridgeFeeDbContract();
