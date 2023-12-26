import Mix from "../asset-details/Mix.js";
import BlockchainType from "../blockchain/BlockchainType.js";
import WalletManager from "../wallet/WalletManager.js";
import Contract from "./Contract.js";
import { EthereumMix } from "./abi/mix/EthereumMix.js";
import WrappedMixArtifact from "./abi/mix/EthereumMix.json" assert {
  type: "json",
};

export default class WrappedMixContract extends Contract<EthereumMix> {
  constructor(chain: BlockchainType, wallet: WalletManager) {
    super(WrappedMixArtifact.abi, chain, Mix.addresses[chain], wallet);
  }
}
