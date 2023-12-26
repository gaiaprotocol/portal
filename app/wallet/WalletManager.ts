import { EventHandler } from "common-app-module/lib/event/EventContainer.js";

export default interface WalletManager {
  getAddress(): Promise<string | undefined>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
