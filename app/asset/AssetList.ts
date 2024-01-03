import { DomNode } from "@common-module/app";
import AssetListItem from "./AssetListItem.js";
import Assets from "./Assets.js";

export default class AssetList extends DomNode {
  public children: AssetListItem[] = [];
  private selected: AssetListItem | undefined;

  constructor() {
    super(".asset-list");
    this.addAllowedEvents("select", "deselect");

    for (const [assetId, asset] of Object.entries(Assets)) {
      const item = new AssetListItem(assetId, asset).appendTo(this);

      item.on("select", () => {
        const old = this.selected;
        this.selected = item;
        old?.deselect();
        this.fireEvent("select", assetId);
      });

      item.on("deselect", () => {
        if (this.selected === item) {
          this.selected = undefined;
          this.fireEvent("deselect");
        }
      });
    }
  }

  public selectAsset(assetId: string | undefined) {
    if (this.selected?.assetId === assetId) return;
    for (const item of this.children) {
      if (item.assetId === assetId) {
        item.select();
        return;
      }
    }
  }
}
