import { Checkbox, DomNode, el } from "@common-module/app";
import AssetInfo from "./AssetInfo.js";

export default class AssetListItem extends DomNode {
  private chainLogoContainer: DomNode;
  private checkbox: Checkbox;

  constructor(public assetId: string, asset: AssetInfo) {
    super(".asset-list-item");
    this.addAllowedEvents("select", "deselect");

    this.style({ backgroundImage: `url(${asset.logo})` }).append(
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
          src: `/images/blockchain-logos/${chain}.svg`,
          style: { zIndex: 100 - index },
        }),
      );
    }

    this.onDom("click", () => this.checkbox.toggle());

    this.checkbox.on("check", () => {
      this.addClass("selected");
      this.fireEvent("select");
    });

    this.checkbox.on("uncheck", () => {
      this.deleteClass("selected");
      this.fireEvent("deselect");
    });
  }

  public select() {
    this.checkbox.check();
  }

  public deselect() {
    this.checkbox.uncheck();
  }

  public toggle() {
    this.checkbox.toggle();
  }
}
