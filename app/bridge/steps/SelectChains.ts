import { MaterialIcon, Router } from "common-app-module";
import BlockchainType from "../../blockchain/BlockchainType.js";
import { default as ChainSelector } from "./ChainSelector.js";
import StepDisplay from "./StepDisplay.js";

export default class SelectChains extends StepDisplay {
  private assetId: string | undefined;
  private fromChainSelector: ChainSelector;
  private toChainSelector: ChainSelector;

  constructor() {
    super(".select-chains", 2, "Select chains");

    this.container.append(
      this.fromChainSelector = new ChainSelector(),
      new MaterialIcon("arrow_forward"),
      this.toChainSelector = new ChainSelector(),
    );

    this.fromChainSelector.on("select", () => this.route());
    this.toChainSelector.on("select", () => this.route());
  }

  private route() {
    if (!this.assetId) Router.go("/");
    else {
      const fromChain = this.fromChainSelector.chain;
      const toChain = this.toChainSelector.chain;
      if (!fromChain) Router.go(`/${this.assetId}`);
      else if (!toChain) Router.go(`/${this.assetId}/${fromChain}`);
      else Router.go(`/${this.assetId}/${fromChain}/${toChain}`);
    }
  }

  public selectAsset(assetId: string | undefined) {
    if (this.assetId === assetId) return this;
    this.assetId = assetId;
    this.fromChainSelector.asset = assetId;
    this.toChainSelector.asset = assetId;
    return this;
  }

  public selectChains(
    fromChain: BlockchainType | undefined,
    toChain: BlockchainType | undefined,
  ) {
    this.fromChainSelector.chain = fromChain;
    this.toChainSelector.except = fromChain;
    this.toChainSelector.chain = toChain;

    if (
      this.fromChainSelector.chain !== fromChain ||
      this.toChainSelector.chain !== toChain
    ) setTimeout(() => this.route());
  }
}
