import { el, View, ViewParams } from "common-app-module";
import Layout from "../layout/Layout.js";
import ChooseAsset from "./steps/ChooseAsset.js";
import ChooseChains from "./steps/ChooseChains.js";
import ExecuteBridge from "./steps/ExecuteBridge.js";

export default class BridgeView extends View {
  private chooseAsset: ChooseAsset;
  private chooseChains: ChooseChains;
  private executeBridge: ExecuteBridge;

  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".bridge-view",
        this.chooseAsset = new ChooseAsset(),
        this.chooseChains = new ChooseChains(),
        this.executeBridge = new ExecuteBridge(),
      ),
    );
    this.render(params.asset, params.fromChain, params.toChain);
  }

  public changeParams(params: ViewParams): void {
    this.render(params.asset, params.fromChain, params.toChain);
  }

  private render(
    asset: string | undefined,
    fromChain: string | undefined,
    toChain: string | undefined,
  ) {
    //TODO:
  }
}
