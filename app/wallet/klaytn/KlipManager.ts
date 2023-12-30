import { EventContainer, Store } from "common-app-module";
import { ethers, Interface, InterfaceAbi, JsonRpcSigner } from "ethers";
import QrCode from "qrcode";
import BlockchainType from "../../blockchain/BlockchainType.js";
import KlaytnWalletManager from "./KlaytnWalletManager.js";
import KlipQrPopup from "./KlipQrPopup.js";

// @ts-ignore
import { getResult, prepare, request } from "klip-sdk";
import { klaytn } from "viem/chains";

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

  public async getBalance(chain: BlockchainType): Promise<bigint | undefined> {
    const provider = new ethers.JsonRpcProvider(klaytn.rpcUrls.default.http[0]);
    return await provider.getBalance(this.store.get<string>("address") ?? "");
  }

  private processParams(param: any): any {
    if (Array.isArray(param)) {
      return param.map(this.processParams);
    } else if (typeof param === "bigint") {
      return param.toString();
    } else if (typeof param === "object" && param !== null) {
      const processedObject: any = {};
      Object.keys(param).forEach((key) => {
        processedObject[key] = this.processParams(param[key]);
      });
      return processedObject;
    }
    return param;
  }

  public async writeManual(
    address: string,
    abi: Interface | InterfaceAbi,
    run: {
      method: string;
      params?: any[] | undefined;
      value?: bigint | undefined;
    },
  ): Promise<void> {
    const res = await prepare.executeContract({
      bappName: BAPP_NAME,
      to: address,
      abi: JSON.stringify(
        (abi as any).filter((abi: any) =>
          abi.name === run.method && abi.type === "function"
        )[0],
      ),
      params: JSON.stringify((run.params ?? []).map(this.processParams)),
      value: (run.value === undefined ? 0 : run.value).toString(),
    });
    await this.request("스마트 계약 실행", res);
  }
}

export default new KlipManager();
