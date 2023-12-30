import {
  configureChains,
  createConfig,
  disconnect,
  fetchBalance,
  getAccount,
  getNetwork,
  getWalletClient,
  mainnet,
  signMessage,
  switchNetwork,
  watchAccount,
} from "@wagmi/core";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";
import { ErrorAlert, EventContainer, msg } from "common-app-module";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { defineChain } from "viem";
import { bsc, polygon } from "viem/chains";
import BlockchainType from "../blockchain/BlockchainType.js";
import Blockchains from "../blockchain/Blockchains.js";
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

  public async getBalance(chain: BlockchainType): Promise<bigint> {
    if (!this.address) throw new Error("Wallet is not connected");
    const result = await fetchBalance({
      address: this.address,
      chainId: Blockchains[chain].chainId,
    });
    return result.value;
  }

  public async disconnect() {
    await disconnect();
  }

  public async getSigner(_chain: BlockchainType): Promise<JsonRpcSigner> {
    if (this.connected !== true) await this.connect();

    const walletClient = await getWalletClient();
    if (!walletClient) {
      new ErrorAlert({
        title: msg("no-wallet-connected-title"),
        message: msg("no-wallet-connected-message"),
      });
      throw new Error("No wallet connected");
    }

    const { chain } = getNetwork();
    if (!chain) {
      new ErrorAlert({
        title: msg("invalid-network-title"),
        message: msg("invalid-network-message"),
      });
      throw new Error("Invalid network");
    }

    const toChainId = Blockchains[_chain].chainId;
    if (chain.id !== toChainId) {
      await switchNetwork({ chainId: toChainId });
    }

    return new JsonRpcSigner(
      new BrowserProvider(walletClient.transport, {
        chainId: toChainId,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
      }),
      walletClient.account.address,
    );
  }
}

export default new EvmWalletManager();
