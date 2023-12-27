import Injeolmi from "../asset-details/Injeolmi.js";
import BlockchainType from "../blockchain/BlockchainType.js";
import WalletManager from "../wallet/WalletManager.js";
import Contract from "./Contract.js";
import { InjeolmiSender } from "./abi/injeolmi/InjeolmiSender.js";
import InjeolmiSenderArtifact from "./abi/injeolmi/InjeolmiSender.json" assert {
  type: "json"
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
