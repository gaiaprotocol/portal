import { Router } from "common-app-module";
import AssetList from "../../asset/AssetList.js";
import StepDisplay from "./StepDisplay.js";

export default class SelectAsset extends StepDisplay {
  private assetList: AssetList;

  constructor() {
    super(".choose-asset", 1, "Select asset to bridge");
    this.container.append(this.assetList = new AssetList());
    this.assetList.on("select", (assetId) => Router.go(`/${assetId}`));
    this.assetList.on("deselect", () => Router.go("/"));
  }

  public async selectAsset(assetId: string | undefined) {
    this.assetList.selectAsset(assetId);
  }
}
