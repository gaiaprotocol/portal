import {
  Alert,
  Button,
  DomNode,
  el,
  ErrorAlert,
  ObjectUtil,
} from "common-app-module";
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
  private actionContainer: DomNode;
  private transactionList: TransactionList;

  constructor() {
    super(".execute-bridge", 3, "Execute Bridge");
    this.container.append(
      this.tokenListContainer = el(".token-list-container"),
      this.actionContainer = el(".action-container"),
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
    this.tokenListContainer.empty();
    this.actionContainer.empty();
    //TODO: this.transactionList.clear();
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
    const asset = this._setup?.asset ? Assets[this._setup.asset] : undefined;
    const amounts = this.tokneList?.amounts;
    const fromChain = this._setup?.fromChain;
    const fromWallet = this._setup?.fromWallet;
    const fromWalletAddress = this._setup?.fromWalletAddress;
    const toChain = this._setup?.toChain;
    const toWallet = this._setup?.toWallet;
    const toWalletAddress = this._setup?.toWalletAddress;

    if (
      asset && amounts && fromChain && fromWallet && fromWalletAddress &&
      toChain && toWallet && toWalletAddress
    ) {
      const approved = await asset.checkApprovalToSender(
        fromChain,
        fromWallet,
        amounts,
      );
      this.actionContainer.empty();

      if (!approved) {
        this.actionContainer.append(
          new Button({
            title: "Approve",
            click: async () => {
              await asset.approveToSender(fromChain, fromWallet, amounts);
              this.checkApprove();
            },
          }),
        );
      } else {
        let sendingId: bigint | undefined;

        const sendButton = new Button({
          title: "Send",
          click: async () => {
            sendButton.disable();
            try {
              sendingId = await asset.send(
                fromChain,
                fromWallet,
                toChain,
                toWalletAddress,
                amounts,
              );
              receiveButton.enable();
            } catch (e: any) {
              new ErrorAlert({
                title: "Send failed",
                message: e.message,
              });
              sendButton.enable();
            }
          },
        });

        const receiveButton = new Button({
          title: "Receive",
          disabled: true,
          click: async () => {
            if (sendingId) {
              receiveButton.disable();
              try {
                await asset.receive(
                  toChain,
                  toWallet,
                  fromChain,
                  fromWalletAddress,
                  sendingId,
                  amounts,
                );
                sendButton.enable();
                new Alert({
                  title: "Receive success",
                  message: "Receive success",
                });
              } catch (e: any) {
                new ErrorAlert({
                  title: "Receive failed",
                  message: e.message,
                });
                receiveButton.enable();
              }
            }
          },
        });

        this.actionContainer.append(sendButton, receiveButton);
      }
    } else {
      this.actionContainer.empty();
    }
  }
}
