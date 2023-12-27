import BlockchainType from "../../blockchain/BlockchainType.js";
import WalletManager from "../../wallet/WalletManager.js";
import Contract from "../Contract.js";
import { ERC721 } from "../abi/standard/ERC721.js";
import Erc721Artifact from "../abi/standard/ERC721.json" assert {
  type: "json",
};

export default class Erc721Contract extends Contract<ERC721> {
  constructor(chain: BlockchainType, address: string, wallet: WalletManager) {
    super(Erc721Artifact.abi, chain, address, wallet);
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
}
