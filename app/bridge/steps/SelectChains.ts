import {
  Debouncer,
  el,
  MaterialIcon,
  ObjectUtil,
  Router,
} from "common-app-module";
import BlockchainType from "../../blockchain/BlockchainType.js";
import BridgeSetup from "../BridgeSetup.js";
import { default as ChainSelector } from "./ChainSelector.js";
import StepDisplay from "./StepDisplay.js";

export default class SelectChains extends StepDisplay {
  private assetId: string | undefined;
  private fromChainSelector: ChainSelector;
  private toChainSelector: ChainSelector;

  constructor() {
    super(".select-chains", 2, "Select chains");
    this.addAllowedEvents("change");

    this.container.append(
      this.fromChainSelector = new ChainSelector(),
      el("a", new MaterialIcon("arrow_forward"), {
        click: () =>
          this.selectChains(
            this.toChainSelector.chain,
            this.fromChainSelector.chain,
          ),
      }),
      this.toChainSelector = new ChainSelector(),
    );

    this.fromChainSelector.on(
      "change",
      () => this.detectAndReflectChangesDebouncer.run(),
    );
    this.toChainSelector.on(
      "change",
      () => this.detectAndReflectChangesDebouncer.run(),
    );
  }

  private detectAndReflectChangesDebouncer = new Debouncer(
    100,
    () => this.detectAndReflectChanges(),
  );

  private prevSetup: BridgeSetup = {};
  private detectAndReflectChanges() {
    // route
    if (!this.assetId) Router.go("/");
    else {
      const fromChain = this.fromChainSelector.chain;
      const toChain = this.toChainSelector.chain;
      if (!fromChain) Router.go(`/${this.assetId}`);
      else if (!toChain) Router.go(`/${this.assetId}/${fromChain}`);
      else Router.go(`/${this.assetId}/${fromChain}/${toChain}`);
    }

    // detect change
    const setup: BridgeSetup = {
      asset: this.assetId,
      fromChain: this.fromChainSelector.chain,
      fromWallet: this.fromChainSelector.wallet,
      fromWalletAddress: this.fromChainSelector.walletAddress,
      toChain: this.toChainSelector.chain,
      toWallet: this.toChainSelector.wallet,
      toWalletAddress: this.toChainSelector.walletAddress,
    };
    if (!ObjectUtil.checkEqual(this.prevSetup, setup)) {
      this.prevSetup = setup;
      this.fireEvent("change", setup);
    }
  }

  public selectAsset(assetId: string | undefined) {
    if (this.assetId === assetId) return this;
    this.assetId = assetId;
    this.fromChainSelector.asset = assetId;
    this.toChainSelector.asset = assetId;
    return this;
  }

  public selectChains(
    fromChain: BlockchainType | undefined,
    toChain: BlockchainType | undefined,
  ) {
    this.fromChainSelector.chain = fromChain;
    this.toChainSelector.except = fromChain;
    this.toChainSelector.chain = toChain;

    if (
      this.fromChainSelector.chain !== fromChain ||
      this.toChainSelector.chain !== toChain
    ) setTimeout(() => this.detectAndReflectChangesDebouncer.run());
  }
}
