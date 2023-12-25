import {
  AppInitializer,
  MaterialIconSystem,
  msg,
  Router,
} from "common-app-module";
import messages_en from "../locales/en.yml";
import messages_ko from "../locales/ko.yml";
import BridgeView from "./bridge/BridgeView.js";
import Config from "./Config.js";
import HistoryView from "./history/HistoryView.js";
import Layout from "./layout/Layout.js";

msg.setMessages({
  en: messages_en,
  ko: messages_ko,
});

MaterialIconSystem.launch();

export default async function initialize(config: Config) {
  AppInitializer.initialize(
    config.supabaseUrl,
    config.supabaseAnonKey,
    config.dev,
  );

  Router.route("**", Layout);
  Router.route(
    [
      "",
      "{asset}",
      "{asset}/{fromChain}",
      "{asset}/{fromChain}/{toChain}",
    ],
    BridgeView,
    ["history"],
  );
  Router.route("history", HistoryView);
}
