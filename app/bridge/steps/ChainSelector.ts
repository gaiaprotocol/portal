import { DomNode, el, Select } from "common-app-module";
import Assets from "../../asset/Assets.js";

export default class ChainSelector extends DomNode {
  private assetId: string | undefined;
  private _chain: string | undefined;

  private select: Select<string>;

  constructor() {
    super(".chain-selector");
    this.addAllowedEvents("select");

    this.append(
      this.select = new Select({
        placeholder: "Select chain",
        options: [],
      }),
    );

    this.select.on("change", (chain) => {
      if (chain === this._chain) return;
      this._chain = chain;
      this.fireEvent("select", chain);
    });
  }

  public set asset(assetId: string | undefined) {
    if (this.assetId === assetId) return;
    this.assetId = assetId;

    const options: { dom: DomNode; value: string }[] = [];
    if (assetId && Assets[assetId]) {
      for (const chain of Object.keys(Assets[assetId].addresses)) {
        options.push({ dom: el(".option", chain), value: chain });
      }
    }
    this.select.options = options;
  }

  public get chain() {
    return this._chain;
  }

  public set chain(chain: string | undefined) {
    if (this._chain === chain) return;
    this._chain = chain;
    this.select.value = chain;
  }
}
