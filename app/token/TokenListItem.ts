import { Debouncer, DomNode, el } from "common-app-module";
import AssetDisplay from "../asset/AssetDisplay.js";
import AssetInfo, { AssetMetadata } from "../asset/AssetInfo.js";
import AssetType from "../asset/AssetType.js";

export default class TokenListItem extends DomNode {
  private amountInput: DomNode<HTMLInputElement> | undefined;
  private selected = false;

  constructor(
    private asset: AssetInfo,
    private token: {
      id: bigint;
      amount: bigint;
      metadata?: AssetMetadata;
    },
  ) {
    super(".token-list-item");
    this.addAllowedEvents("changeAmount");

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
          ".form",
          new AssetDisplay("Your balance", asset, token.amount),
          this.amountInput = el("input", {
            keydown: () => this.changeDebouncer.run(),
          }),
        ),
      );
    }

    if (asset.type === AssetType.ERC721) {
      this.addClass("nft").onDom(
        "click",
        () => {
          this.selected ? this.unselect() : this.select();
          this.fireEvent("changeAmount");
        },
      );
    }
  }

  private select() {
    this.selected = true;
    this.addClass("selected");
  }

  private unselect() {
    this.selected = false;
    this.deleteClass("selected");
  }

  private prevAmount = 0n;
  private changeDebouncer = new Debouncer(100, () => {
    const amount = this.amount;
    if (amount === this.prevAmount) return;
    this.prevAmount = amount;
    amount > 0n ? this.select() : this.unselect();
    this.fireEvent("changeAmount");
  });

  public get tokenId(): bigint {
    return this.token.id;
  }

  public get amount(): bigint {
    if (this.asset.type === AssetType.ERC721) {
      return this.selected ? 1n : 0n;
    } else {
      try {
        return BigInt(this.amountInput?.domElement.value ?? 0);
      } catch (e) {
        console.error(e);
        return 0n;
      }
    }
  }
}
