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
import EvmWalletManager from "./wallet/EvmWalletManager.js";
import GaiaBridgeContract from "./contracts/GaiaBridgeContract.js";
import BlockchainType from "./blockchain/BlockchainType.js";

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

  console.log(await new GaiaBridgeContract(BlockchainType.Ethereum, EvmWalletManager).getSigners());
}
