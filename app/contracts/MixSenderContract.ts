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

      const event = await this.fetchLastEvent(
        writeContract,
        writeContract.filters.SendOverHorizon(
          await this.wallet.getAddress(),
          toChain,
          receiver,
        ),
        receipt.blockNumber,
      );
      if (!event) throw new Error("No events");
      return event.args?.[3];
    } else {
      await this.writeManual("sendOverHorizon", [toChain, receiver, amount]);

      const event = await this.fetchLastEvent(
        this.viewContract,
        this.viewContract.filters.SendOverHorizon(
          await this.wallet.getAddress(),
          toChain,
          receiver,
        ),
      );
      if (!event) throw new Error("No events");
      return event.args?.[3];
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
