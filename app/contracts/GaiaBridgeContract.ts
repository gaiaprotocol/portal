import BlockchainType from "../blockchain/BlockchainType.js";
import WalletManager from "../wallet/WalletManager.js";
import Contract from "./Contract.js";
import { GaiaBridge } from "./abi/gaiabridge/GaiaBridge.js";
import GaiaBridgeArtifact from "./abi/gaiabridge/GaiaBridge.json" assert {
  type: "json"
};

export const addresses: { [chain: string]: string } = {
  [BlockchainType.Ethereum]: "0x2D28272eBfB04f21A675E9955Df09507C6b28b25",
  [BlockchainType.Polygon]: "0x8213c697F6EF3477ee33ebcaFC092c591679c24c",
  [BlockchainType.BNB]: "0x9f69C2a06c97fCAAc1E586b30Ea681c43975F052",
  [BlockchainType.Klaytn]: "0xAdb91C905e792769760034d5607FbBC255A79333",
  [BlockchainType.Bifrost]: "0x9f69C2a06c97fCAAc1E586b30Ea681c43975F052",
};

export enum TokenType {
  ETH,
  ERC20,
  ERC1155,
  ERC721,
}

interface TokenDataToBeBridged {
  tokenType: TokenType;
  tokenName: string;
  tokenAddress: string;
  ids: bigint[];
  amounts: bigint[];
}

export default class GaiaBridgeContract extends Contract<GaiaBridge> {
  constructor(chain: BlockchainType, wallet: WalletManager) {
    super(GaiaBridgeArtifact.abi, chain, addresses[chain], wallet);
  }

  public async getSigners() {
    return await this.viewContract.getSigners();
  }

  public async sendTokens(
    toChainId: number,
    receiver: string,
    tokenData: TokenDataToBeBridged,
    data: string,
    sigs: { r: string; _vs: string }[],
  ): Promise<bigint> {
    const writeContract = await this.getWriteContract();
    if (writeContract) {
      const estimation = await writeContract.sendTokens.estimateGas(
        toChainId,
        receiver,
        tokenData,
        data,
        sigs,
      );
      const tx = await writeContract.sendTokens(
        toChainId,
        receiver,
        tokenData,
        data,
        sigs,
        { gasLimit: estimation * 12n / 10n }, // 20% more gas (for safety)
      );
      const receipt = await tx.wait();
      if (!receipt) throw new Error("No receipt");

      try {
        const event = await this.fetchLastEvent(
          writeContract,
          writeContract.filters.SendTokens(
            await this.wallet.getAddress(),
            toChainId,
          ),
          receipt.blockNumber,
        );
        if (!event) throw new Error("No events");
        return event.args?.[4];
      } catch (e) {
        console.error(e);
        const event = await this.fetchLastEvent(
          this.viewContract,
          this.viewContract.filters.SendTokens(
            await this.wallet.getAddress(),
            toChainId,
          ),
        );
        if (!event) throw new Error("No events");
        return event.args?.[4];
      }
    } else {
      await this.writeManual("approve", [
        toChainId,
        receiver,
        tokenData,
        data,
        sigs,
      ]);

      const event = await this.fetchLastEvent(
        this.viewContract,
        this.viewContract.filters.SendTokens(
          await this.wallet.getAddress(),
          toChainId,
        ),
      );
      if (!event) throw new Error("No events");
      return event.args?.[4];
    }
  }

  public async receiveTokens(
    sender: string,
    fromChainId: number,
    receiver: string,
    tokenData: TokenDataToBeBridged,
    sendingId: bigint,
    feeData: string,
    sigs: { r: string; _vs: string }[],
  ): Promise<void> {
    const writeContract = await this.getWriteContract();
    if (writeContract) {
      const tx = await writeContract.receiveTokens(
        sender,
        fromChainId,
        receiver,
        tokenData,
        sendingId,
        feeData,
        sigs,
      );
      await tx.wait();
    } else {
      await this.writeManual("receiveTokens", [
        sender,
        fromChainId,
        receiver,
        tokenData,
        sendingId,
        feeData,
        sigs,
      ]);
    }
  }
}
