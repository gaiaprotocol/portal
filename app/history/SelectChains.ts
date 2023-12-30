import {
  Debouncer,
  DomNode,
  el,
  MaterialIcon,
  ObjectUtil,
  Router,
} from "common-app-module";
import BlockchainType from "../blockchain/BlockchainType.js";
import BridgeSetup from "../bridge/BridgeSetup.js";
import ChainSelector from "./ChainSelector.js";

export default class SelectChains extends DomNode {
  private fromChainSelector: ChainSelector;
  private toChainSelector: ChainSelector;

  constructor() {
    super(".select-chains");
    this.addAllowedEvents("change");

    this.append(
      el(
        "main",
        this.fromChainSelector = new ChainSelector(),
        el("a", new MaterialIcon("arrow_forward"), {
          click: () =>
            this.selectChains(
              this.toChainSelector.chain,
              this.fromChainSelector.chain,
            ),
        }),
        this.toChainSelector = new ChainSelector(),
      ),
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

  public prevSetup: BridgeSetup = {};
  private detectAndReflectChanges() {
    // route
    const fromChain = this.fromChainSelector.chain;
    const toChain = this.toChainSelector.chain;
    if (!fromChain) Router.go("/history");
    else if (!toChain) Router.go(`/history/${fromChain}`);
    else Router.go(`/history/${fromChain}/${toChain}`);

    // detect change
    const setup: BridgeSetup = {
      fromChain: this.fromChainSelector.chain,
      fromWallet: this.fromChainSelector.wallet,
      sender: this.fromChainSelector.walletAddress,
      toChain: this.toChainSelector.chain,
      toWallet: this.toChainSelector.wallet,
      receiver: this.toChainSelector.walletAddress,
    };
    if (!ObjectUtil.checkEqual(this.prevSetup, setup)) {
      this.prevSetup = setup;
      this.fireEvent("change", setup);
    }
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
