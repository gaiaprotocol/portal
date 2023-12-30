import { DomNode, el, View, ViewParams } from "common-app-module";
import ActivityList from "../activity/ActivityList.js";
import FilteredActivityList from "../activity/FilteredActivityList.js";
import GlobalActivityList from "../activity/GlobalActivityList.js";
import BlockchainType from "../blockchain/BlockchainType.js";
import BridgeSetup from "../bridge/BridgeSetup.js";
import Layout from "../layout/Layout.js";
import SelectChains from "./SelectChains.js";

export default class HistoryView extends View {
  private selectChains: SelectChains;
  private activityListContainer: DomNode;

  constructor(params: ViewParams) {
    super();
    Layout.append(
      this.container = el(
        ".history-view",
        this.selectChains = new SelectChains(),
        this.activityListContainer = el(".activity-list-container"),
      ),
    );

    this.render(
      params.fromChain as BlockchainType | undefined,
      params.toChain as BlockchainType | undefined,
    );

    this.selectChains.on("change", (setup) => this.renderActivityList(setup));
  }

  public changeParams(params: ViewParams): void {
    this.render(
      params.fromChain as BlockchainType | undefined,
      params.toChain as BlockchainType | undefined,
    );
  }

  private render(
    fromChain: BlockchainType | undefined,
    toChain: BlockchainType | undefined,
  ) {
    this.selectChains.selectChains(fromChain, toChain);
    this.renderActivityList(this.selectChains.prevSetup);
  }

  private renderActivityList(setup: BridgeSetup | undefined) {
    this.activityListContainer.empty();
    if (setup && Object.keys(setup || {}).length > 0) {
      new FilteredActivityList(setup).appendTo(
        this.activityListContainer,
      );
    } else {
      new GlobalActivityList().appendTo(this.activityListContainer);
    }
  }
}
