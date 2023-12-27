import Mix from "../asset-details/Mix.js";
import BlockchainType from "../blockchain/BlockchainType.js";
import WalletManager from "../wallet/WalletManager.js";
import Contract from "./Contract.js";
import { MixSender } from "./abi/mix/MixSender.js";
import MixSenderArtifact from "./abi/mix/MixSender.json" assert {
  type: "json",
};

export default class MixSenderContract extends Contract<MixSender> {
  constructor(chain: BlockchainType, wallet: WalletManager) {
    super(MixSenderArtifact.abi, chain, Mix.senderAddresses[chain], wallet);
  }

  public async sendOverHorizon(
    toChain: number,
    receiver: string,
    amount: bigint,
  ): Promise<bigint> {
    const writeContract = await this.getWriteContract();
    if (writeContract) {
      const tx = await writeContract.sendOverHorizon(toChain, receiver, amount);
      const receipt = await tx.wait();
      if (!receipt) throw new Error("No receipt");

      const walletAddress = await this.wallet.getAddress();
      const events = await writeContract.queryFilter(
        writeContract.filters.SendOverHorizon(
          walletAddress,
          toChain,
          receiver,
        ),
        receipt.blockNumber,
        receipt.blockNumber,
      );
      if (!events || events.length === 0) throw new Error("No events");
      return events[events.length - 1]?.args?.[3];
    } else {
      await this.writeManual("sendOverHorizon", [toChain, receiver, amount]);

      const walletAddress = await this.wallet.getAddress();
      const events = await this.viewContract.queryFilter(
        this.viewContract.filters.SendOverHorizon(
          walletAddress,
          toChain,
          receiver,
        ),
        -2000,
      );
      if (!events || events.length === 0) throw new Error("No events");
      return events[events.length - 1]?.args?.[3];
    }
  }

  public async receiveOverHorizon(
    fromChain: number,
    toChain: number,
    sender: string,
    sendId: bigint,
    amount: bigint,
    signature: string,
  ): Promise<void> {
    const writeContract = await this.getWriteContract();
    if (writeContract) {
      const tx = await writeContract.receiveOverHorizon(
        fromChain,
        toChain,
        sender,
        sendId,
        amount,
        signature,
      );
      await tx.wait();
    } else {
      await this.writeManual("receiveOverHorizon", [
        fromChain,
        toChain,
        sender,
        sendId,
        amount,
        signature,
      ]);
    }
  }
}
