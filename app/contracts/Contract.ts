import { BaseContract, ethers, Interface, InterfaceAbi } from "ethers";
import Blockchains from "../blockchain/Blockchains.js";
import BlockchainType from "../blockchain/BlockchainType.js";
import WalletManager from "../wallet/WalletManager.js";
import { TypedDeferredTopicFilter } from "./common.js";

export default abstract class Contract<CT extends BaseContract> {
  protected viewContract!: CT;

  constructor(
    private abi: Interface | InterfaceAbi,
    protected chain: BlockchainType,
    private address: string,
    protected wallet: WalletManager,
  ) {
    this.viewContract = new ethers.Contract(
      address,
      abi,
      new ethers.JsonRpcProvider(Blockchains[chain].rpc),
    ) as any;
  }

  protected async getWriteContract(): Promise<CT | undefined> {
    const signer = await this.wallet.getSigner(this.chain);
    return signer
      ? new ethers.Contract(this.address, this.abi, signer) as any
      : undefined;
  }

  protected async writeManual(
    method: string,
    params: any[],
    value?: bigint,
  ): Promise<void> {
    if (!this.wallet.writeManual) throw new Error("Not supported");
    await this.wallet.writeManual(this.address, this.abi, {
      method,
      params,
      value,
    });
  }

  protected async fetchLastEvent(
    contract: CT,
    filter: TypedDeferredTopicFilter<any>,
    blockNumber?: number,
  ): Promise<ethers.EventLog | undefined> {
    // fix for klaytn
    if (
      this.chain === BlockchainType.Klaytn &&
      contract !== this.viewContract
    ) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    const events = await contract.queryFilter(
      filter,
      blockNumber ?? -2000,
      blockNumber,
    );
    if (!events || events.length === 0) return undefined;
    return events[events.length - 1] as ethers.EventLog;
  }
}
