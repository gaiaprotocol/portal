import { Component, Popup } from "common-app-module";

export default class KlipQrPopup extends Popup {
  constructor(title: string, qr: string) {
    super({ barrierDismissible: true });
    this.append(
      new Component(
        ".popup.klip-qr-popup",
      ),
    );
  }
}
