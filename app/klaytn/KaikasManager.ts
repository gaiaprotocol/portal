import { EventContainer } from "common-app-module";
import WalletManager from "../wallet/WalletManager.js";

class KaikasManager extends EventContainer implements WalletManager {
}

export default new KaikasManager();
