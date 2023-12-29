import Activity from "../database-interface/Activity.js";
import ActivityList from "./ActivityList.js";
import ActivityService from "./ActivityService.js";

export default class FilteredActivityList extends ActivityList {
  private asset: string | undefined;
  private fromChainId: number | undefined;
  private toChainId: number | undefined;
  private sender: string | undefined;
  private receiver: string | undefined;

  constructor() {
    super(".filtered-activity-list", {
      emptyMessage: "No filtered activities.",
    });
  }

  protected async fetchActivities(): Promise<Activity[]> {
    if (
      this.asset && this.fromChainId && this.toChainId && this.sender &&
      this.receiver
    ) {
      return await ActivityService.fetchFilteredActivities(
        this.asset,
        this.fromChainId,
        this.toChainId,
        this.sender,
        this.receiver,
        this.lastCreatedAt,
      );
    } else {
      return [];
    }
  }

  public setFilter(
    asset: string,
    fromChainId: number,
    toChainId: number,
    sender: string,
    receiver: string,
  ) {
    this.asset = asset;
    this.fromChainId = fromChainId;
    this.toChainId = toChainId;
    this.sender = sender;
    this.receiver = receiver;
    this.refresh();
  }

  public clearFilter() {
    this.asset = undefined;
    this.fromChainId = undefined;
    this.toChainId = undefined;
    this.sender = undefined;
    this.receiver = undefined;
    this.refresh();
  }
}
