import { EventContainer } from "common-app-module";
import WalletManager from "./WalletManager.js";
import ConnectKlaytnWalletPopup from "./klaytn/ConnectKlaytnWalletPopup.js";
import KaikasManager from "./klaytn/KaikasManager.js";
import IKlaytnWalletManager from "./klaytn/KlaytnWalletManager.js";
import KlipManager from "./klaytn/KlipManager.js";

const klaytnWallets = [KaikasManager, KlipManager];

class KlaytnWalletManager extends EventContainer implements WalletManager {
  private internalWallet: IKlaytnWalletManager | undefined;

  public async getAddress(): Promise<string | undefined> {
    const addresses = await Promise.all(
      klaytnWallets.map(async (wallet) => {
        const address = await wallet.getAddress();
        if (address) this.internalWallet = wallet;
        return address;
      }),
    );
    return addresses.find((address) => !!address);
  }

  public async connect() {
    new ConnectKlaytnWalletPopup();
  }

  public async disconnect() {
    await this.internalWallet?.disconnect();
  }
}

export default new KlaytnWalletManager();
