import { el, View, ViewParams } from "common-app-module";
import BlockchainType from "../blockchain/BlockchainType.js";
import Layout from "../layout/Layout.js";
import ExecuteBridge from "./steps/ExecuteBridge.js";
import SelectAsset from "./steps/SelectAsset.js";
import SelectChains from "./steps/SelectChains.js";

export default class BridgeView extends View {
  private selectAsset: SelectAsset;
  private selectChains: SelectChains;
  private executeBridge: ExecuteBridge;

  constructor(params: ViewParams) {
    super();

    Layout.append(
      this.container = el(
        ".bridge-view",
        el(
          ".steps",
          this.selectAsset = new SelectAsset(),
          this.selectChains = new SelectChains(),
          this.executeBridge = new ExecuteBridge(),
        ),
      ),
    );

    this.render(
      params.asset,
      params.fromChain as BlockchainType | undefined,
      params.toChain as BlockchainType | undefined,
    );
  }

  public changeParams(params: ViewParams): void {
    this.render(
      params.asset,
      params.fromChain as BlockchainType | undefined,
      params.toChain as BlockchainType | undefined,
    );
  }

  private render(
    asset: string | undefined,
    fromChain: BlockchainType | undefined,
    toChain: BlockchainType | undefined,
  ) {
    this.container.deleteClass("asset-selected", "chain-selected");
    if (asset) this.container.addClass("asset-selected");
    if (fromChain && toChain) this.container.addClass("chain-selected");

    this.selectAsset.selectAsset(asset);
    this.selectChains.selectAsset(asset).selectChains(fromChain, toChain);
  }
}
