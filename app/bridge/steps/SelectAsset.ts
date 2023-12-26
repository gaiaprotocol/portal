import { Router } from "common-app-module";
import AssetList from "../../asset/AssetList.js";
import StepDisplay from "./StepDisplay.js";

export default class SelectAsset extends StepDisplay {
  private assetId: string | undefined;
  private assetList: AssetList;

  constructor() {
    super(".choose-asset", 1, "Select asset to bridge");
    this.container.append(this.assetList = new AssetList());

    this.assetList.on("select", (assetId) => {
      if (this.assetId === assetId) return;
      Router.go(`/${assetId}`);
    });

    this.assetList.on("deselect", () => Router.go("/"));
  }

  public selectAsset(assetId: string | undefined) {
    if (this.assetId === assetId) return;
    this.assetId = assetId;
    this.assetList.selectAsset(assetId);
  }
}
