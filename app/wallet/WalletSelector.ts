import { DomNode } from "common-app-module";

export default class WalletSelector extends DomNode {
  constructor() {
    super(".wallet-selector");
  }

  public set chain(chain: string | undefined) {
    //TODO:
  }
}
