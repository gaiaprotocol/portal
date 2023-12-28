import Injeolmi from "../asset-details/Injeolmi.js";
import BlockchainType from "../blockchain/BlockchainType.js";
import WalletManager from "../wallet/WalletManager.js";
import Contract from "./Contract.js";
import { InjeolmiSender } from "./abi/injeolmi/InjeolmiSender.js";
import InjeolmiSenderArtifact from "./abi/injeolmi/InjeolmiSender.json" assert {
  type: "json",
};

export default class InjeolmiSenderContract extends Contract<InjeolmiSender> {
  constructor(chain: BlockchainType, wallet: WalletManager) {
    super(
      InjeolmiSenderArtifact.abi,
      chain,
      Injeolmi.senderAddresses[chain],
      wallet,
    );
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
    sender: string,
    sendId: bigint,
    amount: bigint,
    signature: string,
  ): Promise<void> {
    const writeContract = await this.getWriteContract();
    if (writeContract) {
      const tx = await writeContract.receiveOverHorizon(
        fromChain,
        sender,
        sendId,
        amount,
        signature,
      );
      await tx.wait();
    } else {
      await this.writeManual("receiveOverHorizon", [
        fromChain,
        sender,
        sendId,
        amount,
        signature,
      ]);
    }
  }
}
