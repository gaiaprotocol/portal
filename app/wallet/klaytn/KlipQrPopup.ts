import {
  Button,
  ButtonType,
  Component,
  el,
  Icon,
  Popup,
} from "@common-module/app";

export default class KlipQrPopup extends Popup {
  constructor(title: string, qr: string) {
    super({ barrierDismissible: true });
    this.append(
      new Component(
        ".popup.klip-qr-popup",
        el(
          "header",
          el("h1", title),
          new Button({
            tag: ".close",
            type: ButtonType.Text,
            icon: new Icon("x"),
            click: () => this.delete(),
          }),
        ),
        el(
          "main",
          el(".qr", el("img", { src: qr })),
          el(
            "p",
            "QR 코드 리더기 또는 카카오톡 앱을 통해 QR 코드를 스캔해주세요.\n카카오톡 실행 ▶ 상단 검색창 클릭 ▶ 코드 스캔 후 로그인\n* Klip > 코드스캔 (사이드메뉴)에서도 스캔이 가능합니다.",
          ),
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
  }
}
