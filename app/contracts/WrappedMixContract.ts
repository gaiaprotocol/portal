import Contract from "./Contract.js";
import { EthereumMix } from "./abi/mix/EthereumMix.js";
import EthereumMixArtifact from "./abi/mix/EthereumMix.json" assert {
  type: "json",
};

class EthereumMixContract extends Contract<EthereumMix> {
  constructor() {
    super(EthereumMixArtifact.abi);
  }
}

export default new EthereumMixContract();
