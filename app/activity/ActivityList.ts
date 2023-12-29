import { DomNode, el, ListLoadingBar, Store } from "common-app-module";
import Activity from "../database-interface/Activity.js";
import ActivityListItem from "./ActivityListItem.js";

export interface ActivityListOptions {
  storeName?: string;
  emptyMessage: string;
}

export default abstract class ActivityList extends DomNode {
  private store: Store | undefined;
  private refreshed = false;
  protected lastCreatedAt: string | undefined;

  private tbody: DomNode;

  constructor(tag: string, options: ActivityListOptions) {
    super("table.activity-list");
    this.store = options.storeName ? new Store(options.storeName) : undefined;

    this.append(
      el(
        "thead",
        el(
          "tr",
          el("th", "Asset"),
          el("th", "From"),
          el("th", "Sender"),
          el("th", "Send Tx"),
          el("th", "To"),
          el("th", "Receiver"),
          el("th", "Tokens"),
          el("th", "Status"),
          el("th", "Receive Tx"),
          el("th", "Retry"),
        ),
      ),
      this.tbody = el("tbody"),
    );

    this.tbody.domElement.setAttribute(
      "data-empty-message",
      options.emptyMessage,
    );

    const cachedActivities = this.store?.get<Activity[]>("cached-activities");
    if (cachedActivities && cachedActivities.length > 0) {
      for (const e of cachedActivities) {
        this.tbody.append(new ActivityListItem(e));
      }
    }
  }

  protected abstract fetchActivities(): Promise<Activity[]>;

  protected async refresh() {
    this.tbody.append(new ListLoadingBar());

    this.lastCreatedAt = undefined;
    const activities = await this.fetchActivities();
    this.store?.set("cached-activities", activities, true);

    if (!this.deleted) {
      this.tbody.empty();
      for (const a of activities) {
        this.tbody.append(new ActivityListItem(a));
      }
      this.lastCreatedAt = activities[activities.length - 1]?.created_at;
      this.refreshed = true;
    }
  }
}
