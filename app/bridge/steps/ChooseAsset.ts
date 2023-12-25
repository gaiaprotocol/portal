import { DomNode } from "common-app-module";
import AssetList from "../../asset/AssetList.js";
import StepDisplay from "./StepDisplay.js";

export default class ChooseAsset extends StepDisplay {
  constructor() {
    super(".choose-asset", 1, "Choose Asset");
    this.append(new AssetList());
  }

  public async choose(assetId: string) {
    //TODO:
  }
}
