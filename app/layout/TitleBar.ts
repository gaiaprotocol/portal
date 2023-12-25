import { Button, DomNode, el, msg } from "common-app-module";
import WalletManager from "../wallet/WalletManager.js";
import TitleBarWalletDisplay from "./title-bar/TitleBarWalletDisplay.js";

export default class TitleBar extends DomNode {
  private titleDisplay: DomNode;
  private walletSection: DomNode;

  constructor() {
    super(".title-bar");
    this.append(
      this.titleDisplay = el("h1"),
      this.walletSection = el("section.wallet"),
    );

    this.renderWalletSection();
    this.onDelegate(
      WalletManager,
      "accountChanged",
      () => this.renderWalletSection(),
    );
  }

  private renderWalletSection() {
    this.walletSection.empty();

    if (!WalletManager.connected) {
      this.walletSection.append(
        new Button({
          tag: ".connect-wallet",
          title: "Connect wallet",
          click: () => WalletManager.connect(),
        }),
      );
    } else {
      this.walletSection.append(
        new TitleBarWalletDisplay(WalletManager.address!),
      );
    }
  }

  public changeTitle(uri: string) {
    this.titleDisplay.text = msg(`title-${uri === "" ? "bridge" : uri}`);
  }
}
