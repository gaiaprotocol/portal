import { Button, DomNode, el } from "common-app-module";
import Assets from "../../asset/Assets.js";
import BlockchainType from "../../blockchain/BlockchainType.js";
import TransactionList from "../../history/TransactionList.js";
import TokenList from "../../token/TokenList.js";
import WalletManager from "../../wallet/WalletManager.js";
import StepDisplay from "./StepDisplay.js";

// input amount
// approve
// send
// receive
export default class ExecuteBridge extends StepDisplay {
  private tokenListContainer: DomNode;
  private input: DomNode<HTMLInputElement>;
  private approveButton: Button;
  private sendButton: Button;
  private receiveButton: Button;
  private transactionList: TransactionList;

  constructor() {
    super(".execute-bridge", 3, "Execute Bridge");
    this.container.append(
      this.tokenListContainer = el(".token-list-container"),
      this.input = el("input.amount", { placeholder: "Amount" }),
      this.approveButton = new Button({
        title: "Approve",
      }),
      this.sendButton = new Button({
        title: "Send",
      }),
      this.receiveButton = new Button({
        title: "Receive",
      }),
      this.transactionList = new TransactionList(),
    );
  }

  public async init(
    assetId: string,
    fromChain: BlockchainType,
    fromWallet: WalletManager,
    toChain: BlockchainType,
    toWallet: WalletManager,
  ) {
    this.tokenListContainer.empty();
    const asset = Assets[assetId];
    if (asset) {
      const tokens = await asset.fetchTokens(fromChain, fromWallet);
      this.tokenListContainer.append(new TokenList(asset, tokens));
    }
  }

  private async checkApprove() {
    //TODO:
  }
}
