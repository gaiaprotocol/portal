import { EventContainer, Store } from "common-app-module";
import { JsonRpcSigner } from "ethers";
import QrCode from "qrcode";
import BlockchainType from "../../blockchain/BlockchainType.js";
import KlaytnWalletManager from "./KlaytnWalletManager.js";
import KlipQrPopup from "./KlipQrPopup.js";

// @ts-ignore
import { getResult, prepare, request } from "klip-sdk";

const BAPP_NAME = "Portal by Gaia Protocol";

class KlipManager extends EventContainer implements KlaytnWalletManager {
  private store = new Store("klip-manager");
  private qrPopup: KlipQrPopup | undefined;

  public installed = true;

  constructor() {
    super();
    this.addAllowedEvents("accountChanged");
  }

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
    this.fireEvent("accountChanged");
  }

  public async disconnect() {
    this.store.delete("address");
    this.fireEvent("accountChanged");
  }

  public async getSigner(
    chain: BlockchainType,
  ): Promise<JsonRpcSigner | undefined> {
    return undefined;
  }

  public async runContractMethod(
    address: string,
    abi: any,
    _params: any[],
    value?: BigNumberish,
  ) {
    const params: any[] = [];
    for (const param of _params) {
      if (Array.isArray(param) === true) {
        const ps: any[] = [];
        for (const p of param) {
          if (p instanceof BigNumber) {
            ps.push(p.toString());
          } else {
            ps.push(p);
          }
        }
        params.push(ps);
      } else if (param instanceof BigNumber) {
        params.push(param.toString());
      } else {
        params.push(param);
      }
    }

    const res = await klipSDK.prepare.executeContract({
      bappName: Klip.BAPP_NAME,
      to: address,
      abi: JSON.stringify(abi),
      params: JSON.stringify(params),
      value: (value === undefined ? 0 : value).toString(),
    });
    await this.request(res);
  }
}

export default new KlipManager();
