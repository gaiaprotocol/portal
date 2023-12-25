import { DomNode } from "common-app-module";
import StepDisplay from "./StepDisplay.js";

export default class SelectChains extends StepDisplay {
  constructor() {
    super(".select-chains", 2, "Select chains");
  }

  public async selectChains(fromChain: string | undefined, toChain: string | undefined) {
    //TODO:
  }
}
