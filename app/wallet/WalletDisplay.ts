import { DomNode, el, Jazzicon, StringUtil } from "common-app-module";

export default class WalletDisplay extends DomNode {
  constructor(walletAddress: string, click: (evnet: MouseEvent) => void) {
    super(".wallet-display");
    this.append(
      new Jazzicon(".avatar", walletAddress),
      el(".name", StringUtil.shortenEthereumAddress(walletAddress)),
    );
    this.onDom("click", click);
  }
}
