import { EventContainer, Store } from "common-app-module";
import QrCode from "qrcode";
import KlaytnWalletManager from "./KlaytnWalletManager.js";
import KlipQrPopup from "./KlipQrPopup.js";

// @ts-ignore
import { getResult, prepare, request } from "klip-sdk";

const BAPP_NAME = "Portal by Gaia Protocol";

class KlipManager extends EventContainer implements KlaytnWalletManager {
  private store = new Store("klip-manager");
  private qrPopup: KlipQrPopup | undefined;

  public installed = true;

  public async getAddress(): Promise<string | undefined> {
    return this.store.get<string>("address");
  }

  private async request(title: string, res: any): Promise<any> {
    request(res.request_key, async () => {
      const qr = await QrCode.toDataURL(
        `https://klipwallet.com/?target=/a2a?request_key=${res.request_key}`,
      );
      this.qrPopup = new KlipQrPopup(title, qr);
    });

    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        const result = await getResult(res.request_key);
        if (result.result) {
          this.qrPopup?.delete();
          this.qrPopup = undefined;
          clearInterval(interval);
          setTimeout(() => resolve(result.result), 2000);
        }
      }, 1000);
    });
  }

  public async connect() {
    const res = await prepare.auth({ bappName: BAPP_NAME });
    const address =
      (await this.request("QR 코드로 Klip 접속", res)).klaytn_address;
    this.store.set("address", address, true);
  }

  public async disconnect() {
    this.store.delete("address");
    location.reload();
  }
}

export default new KlipManager();
