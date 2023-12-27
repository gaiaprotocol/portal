import BlockchainType from "../../blockchain/BlockchainType.js";
import WalletManager from "../../wallet/WalletManager.js";
import Contract from "../Contract.js";
import { ERC20 } from "../abi/standard/ERC20.js";
import Erc20Artifact from "../abi/standard/ERC20.json" assert {
  type: "json",
};

export default class Erc20Contract extends Contract<ERC20> {
  constructor(chain: BlockchainType, address: string, wallet: WalletManager) {
    super(Erc20Artifact.abi, chain, address, wallet);
  }

  public async balanceOf(owner: string): Promise<bigint> {
    return await this.viewContract.balanceOf(owner);
  }

  public async allowance(owner: string, spender: string): Promise<bigint> {
    return await this.viewContract.allowance(owner, spender);
  }

  public async approve(spender: string, amount: bigint): Promise<void> {
    //TODO: await this.sendContract.approve(spender, amount);
  }
}
