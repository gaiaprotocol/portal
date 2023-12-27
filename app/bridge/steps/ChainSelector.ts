import { Debouncer, DomNode, el, Select } from "common-app-module";
import AssetDisplay from "../../asset/AssetDisplay.js";
import Assets from "../../asset/Assets.js";
import BlockchainType from "../../blockchain/BlockchainType.js";
import WalletSelector from "../../wallet/WalletSelector.js";

export default class ChainSelector extends DomNode {
  private assetId: string | undefined;
  private _chain: BlockchainType | undefined;
  private _except: BlockchainType | undefined;

  private select: Select<string>;
  private walletSelector: WalletSelector;
  private balanceDisplay: DomNode;

  constructor() {
    super(".chain-selector");
    this.addAllowedEvents("change");

    this.append(
      this.select = new Select({
        placeholder: "Select chain",
        options: [],
      }),
      this.walletSelector = new WalletSelector(),
      this.balanceDisplay = el(".balance"),
    );

    this.select.on("change", (chain) => {
      if (chain === this._chain) return;
      this._chain = chain;
      this.walletSelector.chain = chain;
      this.detectAndReflectChangesDebouncer.run();
    });

    this.walletSelector.on(
      "accountChanged",
      () => this.detectAndReflectChangesDebouncer.run(),
    );
  }

  private detectAndReflectChangesDebouncer = new Debouncer(
    100,
    () => this.detectAndReflectChanges(),
  );

  private async detectAndReflectChanges() {
    this.fireEvent("change");

    this.balanceDisplay.empty();
    if (this.assetId && this._chain && this.wallet) {
      const asset = Assets[this.assetId];
      if (asset) {
        const balance = await asset.fetchBalance(this._chain, this.wallet);
        this.balanceDisplay.empty().append(
          new AssetDisplay("Balance", asset, balance),
        );
      }
    }
  }

  public get asset() {
    return this.assetId;
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

    this.detectAndReflectChangesDebouncer.run();
  }

  public get except() {
    return this._except;
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
    // ignore if chain is not in the list
    if (chain && !this.select.options.find((o) => o.value === chain)) {
      chain = undefined;
    }

    if (this._chain === chain) return;
    this._chain = chain;
    this.select.value = chain;
    this.walletSelector.chain = chain;

    this.detectAndReflectChangesDebouncer.run();
  }

  public get wallet() {
    return this.walletSelector.wallet;
  }

  public get walletAddress() {
    return this.walletSelector.address;
  }
}
