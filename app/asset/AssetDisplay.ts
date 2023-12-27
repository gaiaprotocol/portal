import { DomNode, el, StringUtil } from "common-app-module";
import { ethers } from "ethers";
import AssetInfo from "./AssetInfo.js";

export default class AssetDisplay extends DomNode {
  constructor(title: string, asset: AssetInfo, amount: bigint) {
    super(".asset-display");
    this.append(
      el("h4", title),
    );
    if (asset.decimals) {
      this.append(el(
        "span.amount",
        StringUtil.numberWithCommas(
          ethers.formatUnits(amount, asset.decimals),
          3,
        ),
        " ",
        el("span.symbol", asset.symbol),
      ));
    } else {
      this.append(el("span.amount", amount.toString()));
    }
  }
}
