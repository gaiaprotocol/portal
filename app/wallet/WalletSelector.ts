import {
  Button,
  DomNode,
  DropdownMenu,
  EventContainer,
  MaterialIcon,
  Snackbar,
} from "common-app-module";
import BlockchainType from "../blockchain/BlockchainType.js";
import Blockchains from "../blockchain/Blockchains.js";
import EvmWalletManager from "./EvmWalletManager.js";
import KlaytnWalletManager from "./KlaytnWalletManager.js";
import WalletDisplay from "./WalletDisplay.js";
import WalletManager from "./WalletManager.js";

export default class WalletSelector extends DomNode {
  private _chain: BlockchainType | undefined;
  public wallet: (WalletManager & EventContainer) | undefined;

  constructor() {
    super(".wallet-selector");
    this.addAllowedEvents("complete");
    this.render();
  }

  public set chain(chain: BlockchainType | undefined) {
    if (this._chain === chain) return;
    this._chain = chain;

    if (this.wallet) this.offDelegate(this.wallet);

    if (!chain) {
      this.wallet = undefined;
    } else if (chain === BlockchainType.Klaytn) {
      this.wallet = KlaytnWalletManager;
    } else {
      this.wallet = EvmWalletManager;
    }
    this.render();

    if (this.wallet) {
      this.onDelegate(
        this.wallet,
        "accountChanged",
        () => this.render(),
      );
    }
  }

  private async render() {
    this.empty();
    if (this.wallet) {
      const address = await this.wallet.getAddress();
      if (!address) {
        this.append(
          new Button({
            title: "Connect Wallet",
            click: () => this.wallet?.connect(),
          }),
        );
      } else {
        new WalletDisplay(address).appendTo(this).onDom(
          "click",
          (event) => {
            if (this._chain) {
              event.stopPropagation();
              const rect = this.rect;
              const chain = Blockchains[this._chain];
              new DropdownMenu({
                left: rect.left,
                top: rect.bottom,
                items: [{
                  icon: new MaterialIcon("content_copy"),
                  title: "Copy address",
                  click: () => {
                    if (address) {
                      navigator.clipboard.writeText(address);
                    }
                    new Snackbar({ message: "Address copied to clipboard" });
                  },
                }, {
                  icon: new MaterialIcon("open_in_new"),
                  title: `View on ${chain.blockExplorer.name}`,
                  click: () =>
                    window.open(
                      `${chain.blockExplorer.url}/address/${address}`,
                      "_blank",
                    ),
                }, {
                  icon: new MaterialIcon("logout"),
                  title: "Disconnect",
                  click: () => this.wallet?.disconnect(),
                }],
              });
            }
          },
        );

        this.fireEvent("complete");
      }
    }
  }
}
