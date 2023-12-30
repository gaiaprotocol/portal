import { DomNode, el, Select } from "common-app-module";
import BlockchainType from "../blockchain/BlockchainType.js";
import WalletSelector from "../wallet/WalletSelector.js";

export default class ChainSelector extends DomNode {
  private _chain: BlockchainType | undefined;
  private _except: BlockchainType | undefined;

  private select: Select<string>;
  private walletSelector: WalletSelector;

  constructor() {
    super(".chain-selector");
    this.addAllowedEvents("change");

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
      this.fireEvent("change");
    });

    this.walletSelector.on(
      "accountChanged",
      () => this.fireEvent("change"),
    );

    this.render();
  }

  public render() {
    const options: { dom: DomNode; value: string }[] = [];
    for (const chain of Object.values(BlockchainType)) {
      if (chain === this._except) continue;
      options.push({ dom: el(".option", chain), value: chain });
    }
    this.select.options = options;
  }

  public get except() {
    return this._except;
  }

  public set except(chain: BlockchainType | undefined) {
    if (this._except === chain) return;
    this._except = chain;
    this.render();
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
  }

  public get wallet() {
    return this.walletSelector.wallet;
  }

  public get walletAddress() {
    return this.walletSelector.address;
  }
}
