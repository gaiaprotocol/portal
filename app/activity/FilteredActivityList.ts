import Blockchains from "../blockchain/Blockchains.js";
import BridgeSetup from "../bridge/BridgeSetup.js";
import Activity from "../database-interface/Activity.js";
import ActivityList from "./ActivityList.js";
import ActivityService from "./ActivityService.js";

export default class FilteredActivityList extends ActivityList {
  constructor(private bridgeSetup: BridgeSetup) {
    super(".filtered-activity-list", {
      emptyMessage: "No filtered activities.",
      bridgeSetup,
    });
    this.refresh();
  }

  protected async fetchActivities(): Promise<Activity[]> {
    if (
      this.bridgeSetup.asset && this.bridgeSetup.fromChain &&
      this.bridgeSetup.toChain && this.bridgeSetup.sender &&
      this.bridgeSetup.receiver
    ) {
      return await ActivityService.fetchFilteredActivities(
        this.bridgeSetup.asset,
        Blockchains[this.bridgeSetup.fromChain].chainId,
        Blockchains[this.bridgeSetup.toChain].chainId,
        this.bridgeSetup.sender,
        this.bridgeSetup.receiver,
        this.lastCreatedAt,
      );
    } else {
      return [];
    }
  }
}
