import {
  Alert,
  Button,
  DomNode,
  el,
  ErrorAlert,
  LoadingSpinner,
  MaterialIcon,
  StringUtil,
} from "@common-module/app";
import { DomChild } from "@common-module/app/lib/dom/DomNode.js";
import { ethers } from "ethers";
import Injeolmi from "../asset-details/Injeolmi.js";
import Mix from "../asset-details/Mix.js";
import Assets from "../asset/Assets.js";
import AssetType from "../asset/AssetType.js";
import Blockchains from "../blockchain/Blockchains.js";
import BlockchainType from "../blockchain/BlockchainType.js";
import BridgeSetup from "../bridge/BridgeSetup.js";
import Activity from "../database-interface/Activity.js";
import WalletDisplay from "../wallet/WalletDisplay.js";

export default class ActivityListItem extends DomNode {
  private status!: DomNode;

  constructor(activity: Activity, bridgeSetup?: BridgeSetup) {
    super("tr.activity-list-item");
    const asset = Assets[activity.asset];
    if (!asset) return;

    const fromChainType = Object.keys(Blockchains).find(
      (type) => Blockchains[type].chainId === activity.from_chain_id,
    ) as BlockchainType;

    const toChainType = Object.keys(Blockchains).find(
      (type) => Blockchains[type].chainId === activity.to_chain_id,
    ) as BlockchainType;

    const amounts: { [tokenId: string]: bigint } = {};
    if (asset === Mix || asset === Injeolmi) {
      amounts["0"] = BigInt(activity.amount_data);
    } else {
      const parts = activity.amount_data.split(",").slice(3);
      const halfIndex = Math.floor(parts.length / 2);
      const ids = parts.slice(0, halfIndex);
      const amountsStr = parts.slice(halfIndex);

      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const amount = amountsStr[i];
        if (id && amount) {
          amounts[id] = BigInt(amount);
        }
      }
    }

    const tokenDisplay: DomChild[] = [];
    for (const tokenId of Object.keys(amounts)) {
      if (asset.type === AssetType.ERC20) {
        const amount = amounts[tokenId];
        tokenDisplay.push(
          el(
            ".token.erc20",
            StringUtil.numberWithCommas(
              ethers.formatUnits(amount, asset.decimals),
              3,
            ),
            " ",
            el("span.symbol", asset.symbol),
          ),
        );
      } else {
        tokenDisplay.push(
          el(
            ".token",
            el("span.id", `#${tokenId}: `),
            el("span.amount", amounts[tokenId].toString()),
          ),
        );
      }
    }

    const isReceiver = bridgeSetup?.toChain === toChainType &&
      bridgeSetup?.receiver === activity.receiver;

    this.append(
      el("td.asset", asset.name),
      el(
        "td.from",
        el(
          "main",
          el("img.chain-logo", {
            src: `/images/blockchain-logos/${fromChainType}.svg`,
          }),
          fromChainType,
        ),
      ),
      el(
        "td.sender",
        new WalletDisplay(activity.sender, () => {
          window.open(
            `${
              Blockchains[fromChainType].blockExplorer.url
            }/address/${activity.sender}`,
          );
        }),
      ),
      el(
        "td.send-tx",
        activity.send_tx
          ? new Button({
            icon: new MaterialIcon("open_in_new"),
            href: `${
              Blockchains[fromChainType].blockExplorer.url
            }/tx/${activity.send_tx}`,
          })
          : "Not synced",
      ),
      el(
        "td.to",
        el(
          "main",
          el("img.chain-logo", {
            src: `/images/blockchain-logos/${toChainType}.svg`,
          }),
          toChainType,
        ),
      ),
      el(
        "td.receiver",
        new WalletDisplay(activity.receiver, () => {
          window.open(
            `${
              Blockchains[toChainType].blockExplorer.url
            }/address/${activity.receiver}`,
          );
        }),
      ),
      el("td.tokens", el("main", ...tokenDisplay)),
      this.status = el(
        "td.status" +
          (activity.receive_tx === undefined ? ".pending" : ".received"),
        el(
          "main",
          ...(activity.receive_tx === undefined
            ? [
              new MaterialIcon("pending"),
              "Pending",
            ]
            : [
              new MaterialIcon("done"),
              "Received",
            ]),
        ),
      ),
      el(
        "td.receive-tx",
        activity.receive_tx
          ? new Button({
            icon: new MaterialIcon("open_in_new"),
            href: `${
              Blockchains[toChainType].blockExplorer.url
            }/tx/${activity.receive_tx}`,
          })
          : "",
      ),
      el(
        "td.retry",
        isReceiver && !activity.receive_tx
          ? new Button({
            title: "Retry",
            click: async (event, retryButton) => {
              retryButton.disable().title = new LoadingSpinner();
              try {
                await asset.receive(
                  bridgeSetup.toChain!,
                  bridgeSetup.toWallet!,
                  fromChainType,
                  activity.sender,
                  activity.sending_id,
                  amounts,
                );
                new Alert({
                  title: "Receive success",
                  message: "Receive success",
                });
                this.status.addClass("received").deleteClass("pending").empty()
                  .append(
                    el(
                      "main",
                      new MaterialIcon("done"),
                      "Received",
                    ),
                  );
                retryButton.delete();
              } catch (e: any) {
                new ErrorAlert({
                  title: "Receive failed",
                  message: e.message,
                });
                retryButton.enable().title = "Retry";
              }
            },
          })
          : "",
      ),
    );
  }
}
