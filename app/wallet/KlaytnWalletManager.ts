import { EventContainer } from "@common-module/app";
import { Interface, InterfaceAbi, JsonRpcSigner } from "ethers";
import BlockchainType from "../blockchain/BlockchainType.js";
import WalletManager from "./WalletManager.js";
import ConnectKlaytnWalletPopup from "./klaytn/ConnectKlaytnWalletPopup.js";
import KaikasManager from "./klaytn/KaikasManager.js";
import IKlaytnWalletManager from "./klaytn/KlaytnWalletManager.js";
import KlipManager from "./klaytn/KlipManager.js";

const klaytnWallets = [KaikasManager, KlipManager];

class KlaytnWalletManager extends EventContainer implements WalletManager {
  private internalWallet: (IKlaytnWalletManager & EventContainer) | undefined;

  constructor() {
    super();
    this.addAllowedEvents("accountChanged");
  }

  public async getAddress(): Promise<string | undefined> {
    if (this.internalWallet) this.offDelegate(this.internalWallet);

    const addresses = await Promise.all(
      klaytnWallets.map(async (wallet) => {
        const address = await wallet.getAddress();
        if (address) this.internalWallet = wallet;
        return address;
      }),
    );

    if (this.internalWallet) {
      this.onDelegate(
        this.internalWallet,
        "accountChanged",
        () => this.fireEvent("accountChanged"),
      );
    }

    return addresses.find((address) => !!address);
  }

  public async connect() {
    if (this.internalWallet) {
      this.offDelegate(this.internalWallet);
      this.internalWallet = undefined;
    }
    await new ConnectKlaytnWalletPopup().wait();
    this.fireEvent("accountChanged");
  }

  public async disconnect() {
    await this.internalWallet?.disconnect();
  }

  public async getSigner(
    chain: BlockchainType,
  ): Promise<JsonRpcSigner | undefined> {
    return await this.internalWallet?.getSigner(chain);
  }

  public async getBalance(chain: BlockchainType): Promise<bigint | undefined> {
    return await this.internalWallet?.getBalance(chain);
  }

  public async writeManual(
    address: string,
    abi: Interface | InterfaceAbi,
    run: {
      method: string;
      params?: any[];
      value?: bigint;
    },
  ): Promise<void> {
    await this.internalWallet?.writeManual?.(address, abi, run);
  }
}

export default new KlaytnWalletManager();
