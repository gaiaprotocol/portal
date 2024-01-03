import { DomNode, el, Jazzicon, StringUtil } from "@common-module/app";
import SidePanel from "../SidePanel.js";

export default class TitleBarWalletDisplay extends DomNode {
  constructor(walletAddress: string) {
    super(".title-bar-wallet-display");

    this.append(
      new Jazzicon(".avatar", walletAddress),
      el(".name", StringUtil.shortenEthereumAddress(walletAddress)),
    );

    this.onDom("click", () => new SidePanel());
  }
}
