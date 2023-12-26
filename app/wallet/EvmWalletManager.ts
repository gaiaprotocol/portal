import {
  configureChains,
  createConfig,
  disconnect,
  fetchBalance,
  getAccount,
  mainnet,
  signMessage,
  watchAccount,
} from "@wagmi/core";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";
import { EventContainer } from "common-app-module";
import { defineChain } from "viem";
import { bsc, polygon } from "viem/chains";
import WalletManager from "./WalletManager.js";

export const bifrost = defineChain({
  id: 3068,
  name: "Bifrost",
  network: "Bifrost",
  nativeCurrency: {
    decimals: 18,
    name: "Bifrost",
    symbol: "BFC",
  },
  rpcUrls: {
    default: { http: ["https://public-01.mainnet.thebifrost.io/rpc"] },
    public: { http: ["https://public-01.mainnet.thebifrost.io/rpc"] },
  },
  blockExplorers: {
    etherscan: {
      name: "BIFROST Network Explorer",
      url: "https://explorer.mainnet.thebifrost.io/",
    },
    default: {
      name: "BIFROST Network Explorer",
      url: "https://explorer.mainnet.thebifrost.io/",
    },
  },
  contracts: {},
});

class EvmWalletManager extends EventContainer implements WalletManager {
  private web3modal!: Web3Modal;
  private _resolveConnection?: () => void;

  public connected = false;

  private get address() {
    return getAccount().address;
  }

  public async getAddress(): Promise<string | undefined> {
    return this.address;
  }

  constructor() {
    super();
    this.addAllowedEvents("accountChanged");
  }

  public init(projectId: string) {
    const chains = [mainnet, polygon, bsc, bifrost];

    const { publicClient } = configureChains(chains, [
      w3mProvider({ projectId }),
    ]);

    const wagmiConfig = createConfig({
      autoConnect: true,
      connectors: w3mConnectors({ projectId, chains }),
      publicClient,
    });

    const ethereumClient = new EthereumClient(wagmiConfig, chains);

    this.web3modal = new Web3Modal({
      projectId,
      themeMode: "dark",
      themeVariables: {
        "--w3m-accent-color": "#9B4CFF",
        "--w3m-background-color": "#9B4CFF",
        "--w3m-z-index": "999999",
      },
    }, ethereumClient);

    this.connected = this.address !== undefined;

    let cachedAddress = this.address;
    watchAccount((account) => {
      this.connected = account.address !== undefined;
      if (this.connected && this._resolveConnection) {
        this._resolveConnection();
      }
      if (cachedAddress !== account.address) {
        this.fireEvent("accountChanged");
        cachedAddress = account.address;
      }
    });
  }

  public async signMessage(message: string) {
    if (!this.address) throw new Error("Wallet is not connected");
    return await signMessage({ message });
  }

  public async connect() {
    if (this.address !== undefined) {
      this.connected = true;
      this.fireEvent("accountChanged");
    }
    return new Promise<void>((resolve) => {
      this._resolveConnection = resolve;
      this.web3modal.openModal();
    });
  }

  public async getBalance(): Promise<bigint> {
    if (!this.address) throw new Error("Wallet is not connected");
    const result = await fetchBalance({ address: this.address });
    return result.value;
  }

  public async disconnect() {
    await disconnect();
  }
}

export default new EvmWalletManager();