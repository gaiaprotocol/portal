import { DomNode } from "common-app-module";
import StepDisplay from "./StepDisplay.js";

// choose from chain
// choose to chain
export default class ChooseChains extends StepDisplay {
  constructor() {
    super(".choose-chains", 2, "Choose Chains");
  }

  public async chooseFromChain(chain: string) {
    //TODO:
  }

  public async chooseToChain(chain: string) {
    //TODO:
  }
}
