import { DomNode, el } from "common-app-module";

export default abstract class StepDisplay extends DomNode {
  protected container: DomNode;

  constructor(tag: string, step: number, title: string) {
    super(tag + `.step-display.step-${step}`);
    this.append(
      el("header", el("span.step-number", String(step)), el("h3", title)),
      this.container = el("main"),
    );
  }
}
