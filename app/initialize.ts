import {
  AppInitializer,
  MaterialIconSystem,
  msg,
  Router,
} from "common-app-module";
import messages_en from "../locales/en.yml";
import messages_ko from "../locales/ko.yml";
import { initBlockchains } from "./blockchain/Blockchains.js";
import BridgeView from "./bridge/BridgeView.js";
import Config from "./Config.js";
import Env from "./Env.js";
import HistoryView from "./history/HistoryView.js";
import Layout from "./layout/Layout.js";
import TrinityManager from "./TrinityManager.js";
import EvmWalletManager from "./wallet/EvmWalletManager.js";

msg.setMessages({
  en: messages_en,
  ko: messages_ko,
});

MaterialIconSystem.launch();

export default async function initialize(config: Config) {
  Env.dev = config.dev;
  Env.infuraKey = config.infuraKey;
  initBlockchains();

  AppInitializer.initialize(
    config.supabaseUrl,
    config.supabaseAnonKey,
    config.dev,
  );

  EvmWalletManager.init(config.walletConnectProjectId);
  TrinityManager.init(
    config.aosServerUrl,
    config.backendUrl,
    config.backendKey,
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
    ["history", "history/{fromChain}", "history/{fromChain}/{toChain}"],
  );
  Router.route([
    "history",
    "history/{fromChain}",
    "history/{fromChain}/{toChain}",
  ], HistoryView);
}
