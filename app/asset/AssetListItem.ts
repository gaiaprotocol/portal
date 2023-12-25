import { Checkbox, DomNode, el } from "common-app-module";
import AssetInfo from "./AssetInfo.js";

export default class AssetListItem extends DomNode {
  private chainLogoContainer: DomNode;
  private checkbox: Checkbox;

  constructor(assetId: string, asset: AssetInfo) {
    super(".asset-list-item");
    this.style({ backgroundImage: `url(${asset.logo})` });
    this.append(
      el(
        "main",
        el("h3", asset.name),
        this.chainLogoContainer = el(".chain-logo-container"),
        this.checkbox = new Checkbox(),
      ),
    );

    for (const [index, chain] of Object.keys(asset.addresses).entries()) {
      this.chainLogoContainer.append(
        el("img.chain-logo", {
          src: `./images/blockchain-logos/${chain}.svg`,
          style: { zIndex: 100 - index },
        }),
      );
    }
  }
}
