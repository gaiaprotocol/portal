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
import Env from "./Env.js";
import HistoryView from "./history/HistoryView.js";
import Layout from "./layout/Layout.js";
import WalletManager from "./wallet/WalletManager.js";

msg.setMessages({
  en: messages_en,
  ko: messages_ko,
});

MaterialIconSystem.launch();

export default async function initialize(config: Config) {
  Env.dev = config.dev;

  AppInitializer.initialize(
    config.supabaseUrl,
    config.supabaseAnonKey,
    config.dev,
  );

  WalletManager.init(config.walletConnectProjectId);

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
