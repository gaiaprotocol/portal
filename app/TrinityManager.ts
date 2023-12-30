import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Supabase } from "common-app-module";
import BlockchainType from "./blockchain/BlockchainType.js";

class TrinityManager {
  private aosServerUrl!: string;
  private backendClient!: SupabaseClient;

  public init(aosServerUrl: string, backendUrl: string, backendKey: string) {
    this.aosServerUrl = aosServerUrl;
    this.backendClient = createClient(backendUrl, backendKey);
  }

  public async trackEvent(chain: BlockchainType, contractType: number) {
    const body = { chain, contractType };
    await Promise.all([
      Supabase.client.functions.invoke("track-contract-events", { body }),
      this.backendClient.functions.invoke("track-contract-events", { body }),
      fetch(
        `${this.aosServerUrl}/track-contract-events`,
        {
          method: "POST",
          body: JSON.stringify(body),
        },
      ),
    ]);
  }

  public async sign(
    asset: string,
    fromChainId: number,
    sender: string,
    sendingId: number,
    toChainId: number,
    walletAddress: string,
  ): Promise<{ address: string; signature: string }[]> {
    const body = {
      asset,
      fromChainId,
      sender,
      sendingId,
      toChainId,
      receiver: walletAddress,
    };
    const [{ data: data1 }, { data: data2 }, data3] = await Promise.all([
      Supabase.client.functions.invoke("sign-portal-send", { body }),
      this.backendClient.functions.invoke("sign-portal-send", { body }),
      (await fetch(
        `${this.aosServerUrl}/sign-portal-send`,
        {
          method: "POST",
          body: JSON.stringify(body),
        },
      )).json(),
    ]);
    return [data1, data2, data3];
  }
}

export default new TrinityManager();
