import { Constants, SupabaseService } from "@common-module/app";
import Activity from "../database-interface/Activity.js";

class ActivityService extends SupabaseService<Activity> {
  constructor() {
    super("portal_activities", "*", 50);
  }

  public async fetchGlobalActivities(lastCreatedAt?: string) {
    return await this.safeSelect((b) =>
      b.order("created_at", { ascending: false }).gt(
        "created_at",
        lastCreatedAt ?? Constants.UNIX_EPOCH_START_DATE,
      )
    );
  }

  public async fetchFilteredActivities(
    asset: string | undefined,
    fromChainId: number,
    toChainId: number,
    sender: string,
    receiver: string,
    lastCreatedAt?: string,
  ) {
    return asset
      ? await this.safeSelect((b) =>
        b
          .order("created_at", { ascending: false })
          .eq("asset", asset)
          .eq("from_chain_id", fromChainId)
          .eq("to_chain_id", toChainId)
          .eq("sender", sender)
          .eq("receiver", receiver)
          .gt("created_at", lastCreatedAt ?? Constants.UNIX_EPOCH_START_DATE)
      )
      : await this.safeSelect((b) =>
        b
          .order("created_at", { ascending: false })
          .eq("from_chain_id", fromChainId)
          .eq("to_chain_id", toChainId)
          .eq("sender", sender)
          .eq("receiver", receiver)
          .gt("created_at", lastCreatedAt ?? Constants.UNIX_EPOCH_START_DATE)
      );
  }
}

export default new ActivityService();
