import { DomNode, el, Select } from "common-app-module";
import Assets from "../../asset/Assets.js";
import BlockchainType from "../../blockchain/BlockchainType.js";
import WalletSelector from "../../wallet/WalletSelector.js";

export default class ChainSelector extends DomNode {
  private assetId: string | undefined;
  private _chain: BlockchainType | undefined;
  private _except: BlockchainType | undefined;

  private select: Select<string>;
  private walletSelector: WalletSelector;

  constructor() {
    super(".chain-selector");
    this.addAllowedEvents("select");

    this.append(
      this.select = new Select({
        placeholder: "Select chain",
        options: [],
      }),
      this.walletSelector = new WalletSelector(),
    );

    this.select.on("change", (chain) => {
      if (chain === this._chain) return;
      this._chain = chain;
      this.walletSelector.chain = chain;
      this.fireEvent("select", chain);
    });
  }

  public set asset(assetId: string | undefined) {
    if (this.assetId === assetId) return;
    this.assetId = assetId;

    const options: { dom: DomNode; value: string }[] = [];
    if (assetId && Assets[assetId]) {
      for (const chain of Object.keys(Assets[assetId].addresses)) {
        if (chain === this._except) continue;
        options.push({ dom: el(".option", chain), value: chain });
      }
    }
    this.select.options = options;
  }

  public set except(chain: BlockchainType | undefined) {
    if (this._except === chain) return;
    this._except = chain;
    const asset = this.assetId;
    this.assetId = undefined;
    this.asset = asset;
  }

  public get chain() {
    return this._chain;
  }

  public set chain(chain: BlockchainType | undefined) {
    if (chain && !this.select.options.find((o) => o.value === chain)) {
      chain = undefined;
    }
    if (this._chain === chain) return;
    this._chain = chain;
    this.select.value = chain;
    this.walletSelector.chain = chain;
  }
}
