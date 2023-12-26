import {
  Button,
  Component,
  el,
  Popup,
  ResponsiveImage,
} from "common-app-module";
import KaikasManager from "./KaikasManager.js";
import KlipManager from "./KlipManager.js";

export default class ConnectKlaytnWalletPopup extends Popup {
  constructor() {
    super({ barrierDismissible: true });
    this.append(
      new Component(
        ".popup.connect-klaytn-wallet-popup",
        el("header", el("h1", "Connect using Klaytn Wallet")),
        el(
          "main",
          new Button({
            icon: new ResponsiveImage("img", "/images/wallet-logos/kaikas.png"),
            title: KaikasManager.installed
              ? "Connect using Kaikas"
              : "Install Kaikas",
            click: () => {
              KaikasManager.installed ? KaikasManager.connect() : window.open(
                "https://chrome.google.com/webstore/detail/kaikas/jblndlipeogpafnldhgmapagcccfchpi",
                "_blank",
              );
            },
          }),
          new Button({
            icon: new ResponsiveImage("img", "/images/wallet-logos/klip.png"),
            title: "Connect using Klip",
            click: () => KlipManager.connect(),
          }),
        ),
      ),
    );
  }
}
