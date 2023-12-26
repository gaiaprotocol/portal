import { DomNode, el, StringUtil } from "common-app-module";
import { ethers } from "ethers";
import AssetInfo, { AssetMetadata } from "../asset/AssetInfo.js";
import AssetType from "../asset/AssetType.js";

export default class TokenListItem extends DomNode {
  constructor(asset: AssetInfo, token: {
    id: bigint;
    amount: bigint;
    metadata?: AssetMetadata;
  }) {
    super(".token-list-item");

    if (asset.type === AssetType.ERC721 || asset.type === AssetType.ERC1155) {
      this.append(
        el(
          ".info",
          el("h3", token.metadata?.name),
          el("h4", el("b", "ID: "), `#${token.id}`),
          { backgroundImage: `url(${token.metadata?.image})` },
        ),
      );
    }

    if (asset.type === AssetType.ERC20 || asset.type === AssetType.ERC1155) {
      this.append(
        el(
          "h4",
          el("b", "Your balance: "),
          asset.decimals
            ? `${
              StringUtil.numberWithCommas(
                ethers.formatUnits(token.amount, asset.decimals),
                3,
              )
            } ${asset.symbol}`
            : token.amount.toString(),
        ),
        el("input"),
      );
    }
  }
}
