import { getNetwork, getWalletClient, switchNetwork } from "@wagmi/core";
import { ErrorAlert, msg } from "common-app-module";
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
import EvmWalletManager from "../wallet/EvmWalletManager.js";
import WalletManager from "../wallet/WalletManager.js";

export default abstract class Contract<CT extends BaseContract> {
  protected viewContract!: CT;

  constructor(
    private abi: Interface | InterfaceAbi,
    private chain: BlockchainType,
    private address: string,
    private wallet: WalletManager,
  ) {
    this.viewContract = new ethers.Contract(
      address,
      abi,
      new ethers.JsonRpcProvider(Blockchains[chain].rpc),
    ) as any;
  }

  protected async getWriteContract(): Promise<CT> {
    if (EvmWalletManager.connected !== true) await EvmWalletManager.connect();

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
