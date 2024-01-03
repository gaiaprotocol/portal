import { DomNode, el, msg } from "@common-module/app";

export default class TitleBar extends DomNode {
  private titleDisplay: DomNode;

  constructor() {
    super(".title-bar");
    this.append(this.titleDisplay = el("h1"));
  }

  public changeTitle(uri: string) {
    this.titleDisplay.text = msg(`title-${uri === "" ? "bridge" : uri}`);
  }
}
