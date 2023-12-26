import { Button, DomNode, DropdownMenu, MaterialIcon } from "common-app-module";
import BlockchainType from "../blockchain/BlockchainType.js";
import EvmWalletManager from "./EvmWalletManager.js";
import KlaytnWalletManager from "./KlaytnWalletManager.js";
import WalletDisplay from "./WalletDisplay.js";
import WalletManager from "./WalletManager.js";

export default class WalletSelector extends DomNode {
  private walletManager: WalletManager | undefined;

  constructor() {
    super(".wallet-selector");
    this.render();
  }

  public set chain(chain: BlockchainType | undefined) {
    if (!chain) {
      this.walletManager = undefined;
    } else if (chain === BlockchainType.Klaytn) {
      this.walletManager = KlaytnWalletManager;
    } else {
      this.walletManager = EvmWalletManager;
    }
    this.render();
  }

  private async render() {
    this.empty();
    if (this.walletManager) {
      const address = await this.walletManager.getAddress();
      if (!address) {
        this.append(
          new Button({
            title: "Connect Wallet",
            click: () => this.walletManager?.connect(),
          }),
        );
      } else {
        const walletDisplay = new WalletDisplay(address).appendTo(this);
        walletDisplay.onDom("click", (event) => {
          event.stopPropagation();
          const rect = this.rect;
          new DropdownMenu({
            left: rect.left,
            top: rect.bottom,
            items: [{
              icon: new MaterialIcon("logout"),
              title: "Disconnect",
              click: async () => {
                await this.walletManager?.disconnect();
                this.render();
              },
            }],
          });
        });
      }
    }
  }
}
