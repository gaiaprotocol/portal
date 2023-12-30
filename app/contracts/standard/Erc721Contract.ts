import BlockchainType from "../../blockchain/BlockchainType.js";
import WalletManager from "../../wallet/WalletManager.js";
import Contract from "../Contract.js";
import Erc721GArtifact from "../abi/standard/ERC721G.json" assert {
  type: "json",
};
import { ERC721G } from "../abi/standard/ERC721G.js";

export default class Erc721Contract extends Contract<ERC721G> {
  constructor(chain: BlockchainType, address: string, wallet: WalletManager) {
    super(Erc721GArtifact.abi, chain, address, wallet);
  }

  public async balanceOf(owner: string): Promise<bigint> {
    return await this.viewContract.balanceOf(owner);
  }

  public async isApprovedForAll(
    owner: string,
    operator: string,
  ): Promise<boolean> {
    return await this.viewContract.isApprovedForAll(owner, operator);
  }

  public async setApprovalForAll(
    operator: string,
    approved: boolean,
  ): Promise<void> {
    const writeContract = await this.getWriteContract();
    if (writeContract) {
      const tx = await writeContract.setApprovalForAll(operator, approved);
      await tx.wait();
    } else {
      await this.writeManual("setApprovalForAll", [operator, approved]);
    }
  }

  public async mint(to: string, tokenId: bigint): Promise<void> {
    const writeContract = await this.getWriteContract();
    if (writeContract) {
      const tx = await writeContract.mint(to, tokenId);
      await tx.wait();
    } else {
      await this.writeManual("mint", [to, tokenId]);
    }
  }

  public async transferFrom(
    from: string,
    to: string,
    tokenId: bigint,
  ): Promise<void> {
    const writeContract = await this.getWriteContract();
    if (writeContract) {
      const tx = await writeContract.transferFrom(from, to, tokenId);
      await tx.wait();
    } else {
      await this.writeManual("transferFrom", [from, to, tokenId]);
    }
  }

  public async grantBunnerRole(to: string): Promise<void> {
    const writeContract = await this.getWriteContract();
    if (writeContract) {
      const tx = await writeContract.grantRole(
        "0x3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a848",
        to,
      );
      await tx.wait();
    } else {
      await this.writeManual("grantRole", [
        "0x3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a848",
        to,
      ]);
    }
  }

  public async hasBunnerRole(to: string): Promise<boolean> {
    return await this.viewContract.hasRole(
      "0x3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a848",
      to,
    );
  }

  public async revokeBunnerRole(to: string): Promise<void> {
    const writeContract = await this.getWriteContract();
    if (writeContract) {
      const tx = await writeContract.revokeRole(
        "0x3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a848",
        to,
      );
      await tx.wait();
    } else {
      await this.writeManual("revokeRole", [
        "0x3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a848",
        to,
      ]);
    }
  }

  public async burn(tokenId: bigint): Promise<void> {
    const writeContract = await this.getWriteContract();
    if (writeContract) {
      const tx = await writeContract.burn(tokenId);
      await tx.wait();
    } else {
      await this.writeManual("burn", [tokenId]);
    }
  }
}
