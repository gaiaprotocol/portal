import { DomNode, el } from "common-app-module";

export default class StepDisplay extends DomNode {
  constructor(tag: string, step: number, title: string) {
    super(tag + ".step-display");
    this.append(
      el("header", el("span.step-number", String(step)), el("h3", title)),
    );
  }
}
