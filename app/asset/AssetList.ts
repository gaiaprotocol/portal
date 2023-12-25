import { DomNode } from "common-app-module";
import AssetListItem from "./AssetListItem.js";
import Assets from "./Assets.js";

export default class AssetList extends DomNode {
  constructor() {
    super(".asset-list");
    for (const [assetId, asset] of Object.entries(Assets)) {
      this.append(new AssetListItem(assetId, asset));
    }
  }
}
