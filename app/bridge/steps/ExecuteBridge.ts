import {
  Alert,
  Button,
  DomNode,
  el,
  ErrorAlert,
  LoadingSpinner,
  ObjectUtil,
} from "common-app-module";
import FilteredActivityList from "../../activity/FilteredActivityList.js";
import KlaydiceSpecialDice from "../../asset-details/KlaydiceSpecialDice.js";
import Assets from "../../asset/Assets.js";
import FeeDbContract from "../../contracts/FeeDbContract.js";
import { TokenType } from "../../contracts/GaiaBridgeContract.js";
import Erc721Contract from "../../contracts/standard/Erc721Contract.js";
import TokenList from "../../token/TokenList.js";
import BridgeSetup from "../BridgeSetup.js";
import StepDisplay from "./StepDisplay.js";
import AssetType from "../../asset/AssetType.js";

// input amount
// approve
// send
// receive
export default class ExecuteBridge extends StepDisplay {
  private _setup: BridgeSetup | undefined;

  private tokenListContainer: DomNode;
  private tokenList: TokenList | undefined;
  private tokenSelectedDisplay: DomNode;
  private actionContainer: DomNode;
  private activityListContainer: DomNode;

  constructor() {
    super(".execute-bridge", 3, "Execute Bridge");
    this.container.append(
      this.tokenListContainer = el(".token-list-container"),
      this.tokenSelectedDisplay = el(".token-selected-display"),
      this.actionContainer = el(".action-container"),
      el(
        ".activity-container",
        el("h3", "History"),
        this.activityListContainer = el("main"),
      ),
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
    this.tokenSelectedDisplay.empty();
    this.actionContainer.empty();
    this.activityListContainer.empty();
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
        this.tokenList = new TokenList(asset, tokens).appendTo(
          this.tokenListContainer,
        ).on("changeAmount", () => this.checkApprove());
        this.checkApprove();
      }
    }
  }

  private async checkApprove() {
    const asset = this._setup?.asset ? Assets[this._setup.asset] : undefined;
    const amounts = this.tokenList?.amounts;
    const fromChain = this._setup?.fromChain;
    const fromWallet = this._setup?.fromWallet;
    const fromWalletAddress = this._setup?.sender;
    const toChain = this._setup?.toChain;
    const toWallet = this._setup?.toWallet;
    const toWalletAddress = this._setup?.receiver;

    if (
      asset && amounts && fromChain && fromWallet && fromWalletAddress &&
      toChain && toWallet && toWalletAddress
    ) {
      if (asset.type !== AssetType.ERC20) {
        this.tokenSelectedDisplay.empty().text = `Selected tokens: ${
          Object.keys(amounts).length
        }`;
      }

      this.activityListContainer.empty().append(
        new FilteredActivityList(this._setup!),
      );

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
            click: async (event, button) => {
              button.disable().title = new LoadingSpinner();
              try {
                await asset.approveToSender(fromChain, fromWallet, amounts);
                this.checkApprove();
              } catch (e: any) {
                new ErrorAlert({
                  title: "Approve failed",
                  message: e.message,
                });
                button.enable().title = "Approve";
              }
            },
          }),
        );
      } else {
        let sendingId: bigint | undefined;

        const sendButton = new Button({
          title: "Send",
          click: async () => {
            if (Object.keys(amounts).length === 0) {
              new ErrorAlert({
                title: "Send failed",
                message: "Please select at least one token.",
              });
              return;
            }

            sendButton.disable().title = new LoadingSpinner();
            try {
              sendingId = await asset.send(
                fromChain,
                fromWallet,
                toChain,
                toWalletAddress,
                amounts,
              );
              receiveButton.enable().title = "Receive";
            } catch (e: any) {
              new ErrorAlert({
                title: "Send failed",
                message: e.message,
              });
              sendButton.enable().title = "Send";
            }
          },
        });

        const receiveButton = new Button({
          title: "Receive",
          disabled: true,
          click: async () => {
            if (sendingId !== undefined) {
              receiveButton.disable().title = new LoadingSpinner();
              try {
                await asset.receive(
                  toChain,
                  toWallet,
                  fromChain,
                  fromWalletAddress,
                  sendingId,
                  amounts,
                );
                sendButton.enable().title = "Send";
                receiveButton.title = "Receive";
                new Alert({
                  title: "Receive success",
                  message: "Receive success",
                });
              } catch (e: any) {
                new ErrorAlert({
                  title: "Receive failed",
                  message: e.message,
                });
                receiveButton.enable().title = "Receive";
              }
            }
          },
        });

        this.actionContainer.append(
          sendButton,
          receiveButton,
          /*new Button({
            title: "TEST",
            click: async () => {
              const tokenId = 100301090173n;
              //const tokenId = 999999999999n;
              const contract = new Erc721Contract(
                fromChain,
                KlaydiceSpecialDice.addresses[fromChain],
                fromWallet,
              );
              const feeDbContract = new FeeDbContract(fromChain, fromWallet);
              console.log(
                await feeDbContract.getFeeInfo(
                  fromWalletAddress,
                  TokenType.ERC721,
                  KlaydiceSpecialDice.addresses[fromChain],
                  [tokenId],
                  [1n],
                  "0x",
                ),
              );
              await contract.transferFrom(
                fromWalletAddress,
                "0x8b2A97bF13d44fB1A2B3EB5a14A69f75aFf1EEB1",
                tokenId,
              );
            },
          }),*/
        );
      }
    } else {
      this.actionContainer.empty();
    }
  }
}
