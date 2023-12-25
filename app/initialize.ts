import {
  AppInitializer,
  MaterialIconSystem,
  msg,
  Router,
} from "common-app-module";
import Config from "./Config.js";

msg.setMessages({});

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
    Bridge,
    ["history"],
  );
  Router.route("history", History);
}
