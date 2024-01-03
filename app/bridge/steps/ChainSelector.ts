import {
  Debouncer,
  DomNode,
  el,
  Select,
  StringUtil,
  WarningMessageBox,
} from "@common-module/app";
import { ethers } from "ethers";
import AssetDisplay from "../../asset/AssetDisplay.js";
import Assets from "../../asset/Assets.js";
import Blockchains from "../../blockchain/Blockchains.js";
import BlockchainType from "../../blockchain/BlockchainType.js";
import WalletSelector from "../../wallet/WalletSelector.js";

export default class ChainSelector extends DomNode {
  private assetId: string | undefined;
  private _chain: BlockchainType | undefined;
  private _except: BlockchainType | undefined;

  private select: Select<string>;
  private walletSelector: WalletSelector;
  private balanceDisplay: DomNode;
  private insufficientGasBalanceDisplay: DomNode;

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
      this.insufficientGasBalanceDisplay = el(".insufficient-gas-balance"),
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
    if (
      this.assetId && this._chain && this.wallet && this.walletSelector.address
    ) {
      const asset = Assets[this.assetId];
      if (asset) {
        const balance = await asset.fetchBalance(this._chain, this.wallet);
        this.balanceDisplay.empty().append(
          new AssetDisplay("Balance", asset, balance),
        );
      }
    }

    this.insufficientGasBalanceDisplay.empty();
    if (this._chain) {
      const eth = await this.wallet?.getBalance(this._chain);
      if (eth && eth < Blockchains[this._chain].minimumGasBalance) {
        this.insufficientGasBalanceDisplay.append(
          new WarningMessageBox({
            message: `Your current coin balance is ${
              StringUtil.numberWithCommas(
                ethers.formatEther(eth),
                3,
              )
            }, which may be insufficient to cover the minimum gas payment. It is recommended that you replenish your funds.`,
          }),
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
