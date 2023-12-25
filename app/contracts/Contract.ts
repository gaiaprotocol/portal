import { getNetwork, getWalletClient, switchNetwork } from "@wagmi/core";
import { ErrorAlert, EventContainer, msg } from "common-app-module";
import {
  BaseContract,
  BrowserProvider,
  ethers,
  Interface,
  InterfaceAbi,
  JsonRpcSigner,
} from "ethers";
import BlockchainType from "../blockchain/BlockchainType.js";
import Blockchains from "../blockchain/Blockchains.js";
import WalletManager from "../wallet/WalletManager.js";

export default abstract class Contract<CT extends BaseContract>
  extends EventContainer {
  protected viewContract!: CT;

  private chain!: string;
  private address!: string;

  constructor(private abi: Interface | InterfaceAbi) {
    super();
  }

  public init(chain: BlockchainType, address: string) {
    this.chain = chain;
    this.address = address;

    this.viewContract = new ethers.Contract(
      this.address,
      this.abi,
      new ethers.JsonRpcProvider(Blockchains[chain].rpc),
    ) as any;
  }

  protected async getWriteContract(): Promise<CT> {
    if (WalletManager.connected !== true) await WalletManager.connect();

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

    if (chain.id !== Blockchains[this.chain].chainId) {
      await switchNetwork({ chainId: Blockchains[this.chain].chainId });
    }

    const signer = new JsonRpcSigner(
      new BrowserProvider(walletClient.transport, {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
      }),
      walletClient.account.address,
    );

    return new ethers.Contract(this.address, this.abi, signer) as any;
  }
}
