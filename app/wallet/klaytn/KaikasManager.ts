import { EventContainer, Store } from "common-app-module";
import { ethers, JsonRpcSigner } from "ethers";
import BlockchainType from "../../blockchain/BlockchainType.js";
import Blockchains from "../../blockchain/Blockchains.js";
import KlaytnWalletManager from "./KlaytnWalletManager.js";

class KaikasManager extends EventContainer implements KlaytnWalletManager {
  private store = new Store("kaikas-manager");
  private klaytn: any = (window as any).klaytn;
  private provider: ethers.BrowserProvider | undefined;

  public get installed() {
    return this.klaytn?.isKaikas === true;
  }

  constructor() {
    super();
    this.addAllowedEvents("accountChanged");
    if (this.installed) {
      this.provider = new ethers.BrowserProvider(this.klaytn);
      this.klaytn.on("accountsChanged", () => this.fireEvent("accountChanged"));
    }
  }

  public async getAddress(): Promise<string | undefined> {
    if (this.store.get("temp-disconnected")) return undefined;
    return this.provider
      ? (await this.provider.listAccounts())[0]?.address
      : undefined;
  }

  public async connect() {
    this.store.delete("temp-disconnected");
    await this.klaytn?.request({ method: "eth_requestAccounts" });
    this.fireEvent("accountChanged");
  }

  public async disconnect() {
    this.store.set("temp-disconnected", true);
    this.fireEvent("accountChanged");
  }

  public async getSigner(
    chain: BlockchainType,
  ): Promise<JsonRpcSigner | undefined> {
    const chainId = parseInt(this.klaytn.networkVersion);
    if (chainId !== Blockchains[chain].chainId) {
      await this.klaytn.request({
        method: "wallet_switchEthereumChain",
        params: [{
          chainId: ethers.toQuantity(Blockchains[chain].chainId),
        }],
      });
    }
    return await this.provider?.getSigner();
  }

  public async getBalance(): Promise<bigint | undefined> {
    const address = await this.getAddress();
    if (!address) return undefined;
    return await this.provider?.getBalance(address);
  }
}

export default new KaikasManager();
