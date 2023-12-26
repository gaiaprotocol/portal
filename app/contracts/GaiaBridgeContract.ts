import BlockchainType from "../blockchain/BlockchainType.js";
import WalletManager from "../wallet/WalletManager.js";
import Contract from "./Contract.js";
import { GaiaBridge } from "./abi/gaiabridge/GaiaBridge.js";
import GaiaBridgeArtifact from "./abi/gaiabridge/GaiaBridge.json" assert {
  type: "json",
};

const addresses: { [chain: string]: string } = {
  [BlockchainType.Ethereum]: "0x2D28272eBfB04f21A675E9955Df09507C6b28b25",
  [BlockchainType.Polygon]: "0x8213c697F6EF3477ee33ebcaFC092c591679c24c",
  [BlockchainType.BNB]: "0x9f69C2a06c97fCAAc1E586b30Ea681c43975F052",
  [BlockchainType.Klaytn]: "0xAdb91C905e792769760034d5607FbBC255A79333",
  [BlockchainType.Bifrost]: "0x9f69C2a06c97fCAAc1E586b30Ea681c43975F052",
};

export default class GaiaBridgeContract extends Contract<GaiaBridge> {
  constructor(chain: BlockchainType, wallet: WalletManager) {
    super(GaiaBridgeArtifact.abi, chain, addresses[chain], wallet);
  }
}
