import BlockchainType from "../blockchain/BlockchainType.js";
import WalletManager from "../wallet/WalletManager.js";
import Contract from "./Contract.js";
import { ERC721GEnumerableUtil } from "./abi/nftutil/NftUtil.js";
import NftUtilArtifact from "./abi/nftutil/NftUtil.json" assert {
  type: "json",
};

const addresses: { [chain: string]: string } = {
  [BlockchainType.BNB]: "0xDcf835783dABe00B2aA28e84a9040A47383c1419",
  [BlockchainType.Bifrost]: "0xDFD3Fc8277D2b512D21780c3773F7Feea5112475",
};

export default class NftUtilContract extends Contract<ERC721GEnumerableUtil> {
  constructor(chain: BlockchainType, wallet: WalletManager) {
    super(NftUtilArtifact.abi, chain, addresses[chain], wallet);
  }

  public async getTokenIds(
    nftAddress: string,
    owner: string,
  ): Promise<bigint[]> {
    return await this.viewContract.getTotalTokenIds(nftAddress, owner);
  }
}
