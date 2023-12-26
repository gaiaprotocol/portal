import { DomNode } from "common-app-module";
import AssetInfo, { AssetMetadata } from "../asset/AssetInfo.js";
import TokenListItem from "./TokenListItem.js";

export default class TokenList extends DomNode {
  constructor(asset: AssetInfo, tokens: {
    id: bigint;
    amount: bigint;
    metadata?: AssetMetadata;
  }[]) {
    super(".token-list");
    for (const token of tokens) {
      this.append(new TokenListItem(asset, token));
    }
  }
}
