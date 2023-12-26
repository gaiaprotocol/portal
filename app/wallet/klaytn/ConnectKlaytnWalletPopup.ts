import {
  Button,
  ButtonType,
  Component,
  el,
  Icon,
  Popup,
  ResponsiveImage,
} from "common-app-module";
import KaikasManager from "./KaikasManager.js";
import KlipManager from "./KlipManager.js";

export default class ConnectKlaytnWalletPopup extends Popup {
  private resolve: (() => void) | undefined;
  private reject: (() => void) | undefined;

  constructor() {
    super({ barrierDismissible: true });
    this.append(
      new Component(
        ".popup.connect-klaytn-wallet-popup",
        el(
          "header",
          el("h1", "Connect using Klaytn Wallet"),
          new Button({
            tag: ".close",
            type: ButtonType.Text,
            icon: new Icon("x"),
            click: () => this.delete(),
          }),
        ),
        el(
          "main",
          new Button({
            icon: new ResponsiveImage("img", "/images/wallet-logos/kaikas.png"),
            title: KaikasManager.installed
              ? "Connect using Kaikas"
              : "Install Kaikas",
            click: async () => {
              if (KaikasManager.installed) {
                await KaikasManager.connect();
                this.resolve?.();
                this.reject = undefined;
                this.delete();
              } else {
                window.open(
                  "https://chrome.google.com/webstore/detail/kaikas/jblndlipeogpafnldhgmapagcccfchpi",
                  "_blank",
                );
                this.reject?.();
              }
            },
          }),
          new Button({
            icon: new ResponsiveImage("img", "/images/wallet-logos/klip.png"),
            title: "Connect using Klip",
            click: async () => {
              await KlipManager.connect();
              this.resolve?.();
              this.reject = undefined;
              this.delete();
            },
          }),
        ),
        el(
          "footer",
          new Button({
            title: "Cancel",
            click: () => this.delete(),
          }),
        ),
      ),
    );

    this.on("delete", () => this.reject?.());
  }

  public async wait(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
