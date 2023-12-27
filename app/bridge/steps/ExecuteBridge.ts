import { Button, DomNode, el, ObjectUtil } from "common-app-module";
import Assets from "../../asset/Assets.js";
import TransactionList from "../../history/TransactionList.js";
import TokenList from "../../token/TokenList.js";
import BridgeSetup from "../BridgeSetup.js";
import StepDisplay from "./StepDisplay.js";

// input amount
// approve
// send
// receive
export default class ExecuteBridge extends StepDisplay {
  private _setup: BridgeSetup | undefined;

  private tokenListContainer: DomNode;
  private tokneList: TokenList | undefined;

  private approveButton: Button;
  private sendButton: Button;
  private receiveButton: Button;
  private transactionList: TransactionList;

  constructor() {
    super(".execute-bridge", 3, "Execute Bridge");
    this.container.append(
      this.tokenListContainer = el(".token-list-container"),
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

  public get setup() {
    return this._setup;
  }

  public set setup(setup: BridgeSetup | undefined) {
    if (ObjectUtil.checkEqual(this._setup, setup)) return;
    this._setup = setup;
    this.render();
  }

  private clear() {
    //TODO:
    console.log("clear");
  }

  public async render() {
    this.tokenListContainer.empty();
    if (!this._setup || Object.values(this._setup).some((v) => !v)) {
      this.clear();
    } else {
      const asset = Assets[this._setup.asset!];
      if (!asset) this.clear();
      else {
        const tokens = await asset.fetchTokens(
          this._setup.fromChain!,
          this._setup.fromWallet!,
        );
        this.tokneList = new TokenList(asset, tokens).appendTo(
          this.tokenListContainer,
        ).on("changeAmount", () => this.checkApprove());
      }
    }
  }

  private async checkApprove() {
    //TODO:
    console.log(this.tokneList?.amounts);
  }
}
