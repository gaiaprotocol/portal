import { DomNode } from "@common-module/app";
import AssetInfo, { AssetMetadata } from "../asset/AssetInfo.js";
import TokenListItem from "./TokenListItem.js";

export default class TokenList extends DomNode {
  public children: TokenListItem[] = [];

  constructor(asset: AssetInfo, tokens: {
    id: bigint;
    amount: bigint;
    metadata?: AssetMetadata;
  }[]) {
    super(".token-list");
    this.addAllowedEvents("changeAmount");
    this.domElement.setAttribute("data-empty-message", "You have no tokens.");

    for (const token of tokens) {
      const item = new TokenListItem(asset, token).appendTo(this);
      item.on("changeAmount", () => this.fireEvent("changeAmount"));
    }
  }

  public get amounts(): { [tokenId: string]: bigint } {
    const amounts: { [tokenId: string]: bigint } = {};
    for (const child of this.children) {
      if (child.amount > 0n) {
        amounts[child.tokenId.toString()] = child.amount;
      }
    }
    return amounts;
  }
}
